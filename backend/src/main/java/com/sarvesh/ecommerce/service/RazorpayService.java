package com.sarvesh.ecommerce.service;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.sarvesh.ecommerce.exception.ApiException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;

@Service
public class RazorpayService {

    private static final Logger log = LoggerFactory.getLogger(RazorpayService.class);

    private static final long MAX_AMOUNT_PAISE = 500_000_00L;

    @Value("${razorpay.key.id:}")
    private String keyId;

    @Value("${razorpay.key.secret:}")
    private String keySecret;

    public boolean isConfigured() {
        return StringUtils.hasText(keyId) && StringUtils.hasText(keySecret);
    }

    public String getPublicKeyId() {
        return keyId;
    }

    public JSONObject createOrder(double amountInRupees) {
        if (!isConfigured()) {
            throw new ApiException(
                    "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.",
                    HttpStatus.SERVICE_UNAVAILABLE);
        }

        long amountInPaise = Math.round(amountInRupees * 100);

        log.info("Creating Razorpay order — total: INR {}, amount: {} paise, currency: INR",
                amountInRupees, amountInPaise);

        if (amountInPaise > MAX_AMOUNT_PAISE) {
            log.warn("Order total INR {} ({} paise) exceeds Razorpay's maximum allowed amount of INR {}",
                    amountInRupees, amountInPaise, MAX_AMOUNT_PAISE / 100);
            throw new ApiException(
                    "This order total (₹" + amountInRupees + ") exceeds the maximum amount allowed for online "
                            + "payment (₹" + (MAX_AMOUNT_PAISE / 100) + "). Please remove some items or split "
                            + "this into smaller orders, or choose Cash on Delivery instead.",
                    HttpStatus.BAD_REQUEST);
        }

        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("payment_capture", 1);

            com.razorpay.Order order = client.orders.create(orderRequest);
            return new JSONObject(order.toString());
        } catch (RazorpayException e) {
            throw new ApiException("Could not create Razorpay order: " + e.getMessage(),
                    HttpStatus.BAD_GATEWAY);
        }
    }

    public boolean verifySignature(String orderId, String paymentId, String signature) {
        if (!isConfigured() || orderId == null || paymentId == null || signature == null) {
            return false;
        }
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString().equals(signature);
        } catch (NoSuchAlgorithmException | java.security.InvalidKeyException e) {
            return false;
        }
    }
}
