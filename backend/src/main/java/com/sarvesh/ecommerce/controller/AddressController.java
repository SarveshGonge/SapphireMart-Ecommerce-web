package com.sarvesh.ecommerce.controller;

import com.sarvesh.ecommerce.dto.AddressRequest;
import com.sarvesh.ecommerce.model.Address;
import com.sarvesh.ecommerce.security.UserPrincipal;
import com.sarvesh.ecommerce.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<List<Address>> list(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(addressService.getAddresses(principal.getUser()));
    }

    @PostMapping
    public ResponseEntity<Address> create(@AuthenticationPrincipal UserPrincipal principal,
                                           @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.create(principal.getUser(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> update(@AuthenticationPrincipal UserPrincipal principal,
                                           @PathVariable Long id,
                                           @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.update(principal.getUser(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserPrincipal principal,
                                        @PathVariable Long id) {
        addressService.delete(principal.getUser(), id);
        return ResponseEntity.noContent().build();
    }
}
