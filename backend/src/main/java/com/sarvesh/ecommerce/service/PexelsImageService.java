package com.sarvesh.ecommerce.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

/**
 * Fetches real, relevant product photos from the Pexels Search API so that
 * different products of the same type each get a distinct real photo instead
 * of all sharing one image.
 *
 * Requires a free API key from https://www.pexels.com/api/ set via the
 * PEXELS_API_KEY environment variable. Without a key, callers should fall
 * back to a single curated photo per product type — this service returns an
 * empty list rather than throwing, so seeding still completes successfully
 * either way.
 */
@Service
public class PexelsImageService {

    private static final Logger log = LoggerFactory.getLogger(PexelsImageService.class);
    private static final String SEARCH_URL = "https://api.pexels.com/v1/search?query=%s&per_page=%d&orientation=square";

    @Value("${pexels.api.key:}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean isConfigured() {
        return StringUtils.hasText(apiKey);
    }

    public List<String> searchImages(String query, int count) {
        if (!isConfigured()) {
            return List.of();
        }
        try {
            int perPage = Math.min(Math.max(count, 1), 80);
            String url = String.format(SEARCH_URL, URLEncoder.encode(query, StandardCharsets.UTF_8), perPage);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", apiKey)
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.warn("Pexels API returned status {} for query '{}' — falling back to curated image.",
                        response.statusCode(), query);
                return List.of();
            }

            JsonNode root = objectMapper.readTree(response.body());
            JsonNode photos = root.path("photos");
            List<String> urls = new ArrayList<>();
            for (JsonNode photo : photos) {
                String src = photo.path("src").path("medium").asText(null);
                if (src != null) {
                    urls.add(src);
                }
            }
            return urls;
        } catch (Exception e) {
            log.warn("Pexels image search failed for query '{}': {} — falling back to curated image.",
                    query, e.getMessage());
            return List.of();
        }
    }
}
