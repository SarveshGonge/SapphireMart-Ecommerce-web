package com.sarvesh.ecommerce.dto;

import com.sarvesh.ecommerce.model.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutRequest {
    @NotBlank
    private String shippingAddress;

    @NotNull
    private PaymentMethod paymentMethod;

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
