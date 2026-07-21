package com.sarvesh.ecommerce.service;

import com.sarvesh.ecommerce.dto.AddressRequest;
import com.sarvesh.ecommerce.exception.ApiException;
import com.sarvesh.ecommerce.model.Address;
import com.sarvesh.ecommerce.model.User;
import com.sarvesh.ecommerce.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;

    public List<Address> getAddresses(User user) {
        return addressRepository.findByUserIdOrderByIsDefaultDesc(user.getId());
    }

    @Transactional
    public Address create(User user, AddressRequest req) {
        boolean makeDefault = Boolean.TRUE.equals(req.getIsDefault())
                || addressRepository.findByUserIdOrderByIsDefaultDesc(user.getId()).isEmpty();

        if (makeDefault) {
            clearExistingDefault(user);
        }

        Address address = Address.builder()
                .user(user)
                .label(req.getLabel())
                .fullName(req.getFullName())
                .phone(req.getPhone())
                .addressLine1(req.getAddressLine1())
                .addressLine2(req.getAddressLine2())
                .city(req.getCity())
                .state(req.getState())
                .postalCode(req.getPostalCode())
                .country(req.getCountry() != null ? req.getCountry() : "India")
                .isDefault(makeDefault)
                .build();
        return addressRepository.save(address);
    }

    @Transactional
    public Address update(User user, Long id, AddressRequest req) {
        Address address = getOwned(user, id);

        if (Boolean.TRUE.equals(req.getIsDefault()) && !address.getIsDefault()) {
            clearExistingDefault(user);
            address.setIsDefault(true);
        }

        address.setLabel(req.getLabel());
        address.setFullName(req.getFullName());
        address.setPhone(req.getPhone());
        address.setAddressLine1(req.getAddressLine1());
        address.setAddressLine2(req.getAddressLine2());
        address.setCity(req.getCity());
        address.setState(req.getState());
        address.setPostalCode(req.getPostalCode());
        if (req.getCountry() != null) {
            address.setCountry(req.getCountry());
        }
        return addressRepository.save(address);
    }

    @Transactional
    public void delete(User user, Long id) {
        Address address = getOwned(user, id);
        addressRepository.delete(address);

        if (Boolean.TRUE.equals(address.getIsDefault())) {
            List<Address> remaining = addressRepository.findByUserIdOrderByIsDefaultDesc(user.getId());
            if (!remaining.isEmpty()) {
                Address next = remaining.get(0);
                next.setIsDefault(true);
                addressRepository.save(next);
            }
        }
    }

    private void clearExistingDefault(User user) {
        addressRepository.findByUserIdOrderByIsDefaultDesc(user.getId()).stream()
                .filter(Address::getIsDefault)
                .forEach(a -> {
                    a.setIsDefault(false);
                    addressRepository.save(a);
                });
    }

    private Address getOwned(User user, Long id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ApiException("Address not found", HttpStatus.NOT_FOUND));
        if (!address.getUser().getId().equals(user.getId())) {
            throw new ApiException("Not authorized to modify this address", HttpStatus.FORBIDDEN);
        }
        return address;
    }
}
