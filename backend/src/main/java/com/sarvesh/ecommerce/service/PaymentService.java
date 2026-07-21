package com.sarvesh.ecommerce.service;

import com.sarvesh.ecommerce.dto.CheckoutRequest;
import com.sarvesh.ecommerce.exception.ApiException;
import com.sarvesh.ecommerce.model.PaymentMethod;
import com.sarvesh.ecommerce.model.PaymentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final RazorpayService razorpayService;

    public PaymentResult processPayment(CheckoutRequest request) {
        PaymentMethod method = request.getPaymentMethod();

        return switch (method) {
            case CASH_ON_DELIVERY -> new PaymentResult(PaymentStatus.PENDING, null);
            case RAZORPAY -> processRazorpay(request);
        };
    }

    private PaymentResult processRazorpay(CheckoutRequest request) {
        if (request.getRazorpayOrderId() == null || request.getRazorpayPaymentId() == null
                || request.getRazorpaySignature() == null) {
            throw new ApiException("Missing Razorpay payment details", HttpStatus.BAD_REQUEST);
        }

        boolean valid = razorpayService.verifySignature(
                request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature());

        if (!valid) {
            throw new ApiException("Payment verification failed", HttpStatus.PAYMENT_REQUIRED);
        }

        return new PaymentResult(PaymentStatus.PAID, request.getRazorpayPaymentId());
    }

    public record PaymentResult(PaymentStatus status, String reference) {}
}
