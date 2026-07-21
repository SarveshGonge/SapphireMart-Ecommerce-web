package com.sarvesh.ecommerce.config;

import com.sarvesh.ecommerce.model.Product;
import com.sarvesh.ecommerce.model.Role;
import com.sarvesh.ecommerce.model.User;
import com.sarvesh.ecommerce.repository.ProductRepository;
import com.sarvesh.ecommerce.repository.UserRepository;
import com.sarvesh.ecommerce.service.PexelsImageService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    private final PexelsImageService pexelsImageService;

    private record Template(
            List<String> nameOptions, String description, String category, String searchQuery,
            long fallbackPexelsId, double minPrice, double maxPrice, double marginPct) {
    }

    private static final Template[] TEMPLATES = {
            new Template(List.of(
                    "boAt Rockerz 450 Bluetooth Headphones",
                    "JBL Tune 510BT Wireless Headphones",
                    "Sony MDR-ZX110 Headphones",
                    "Sennheiser HD 206 Headphones",
                    "Skullcandy Hesh Evo Wireless Headphones",
                    "Zebronics Zeb-Thunder Bluetooth Headphones"),
                    "Over-ear headphones with active noise cancellation and 30-hour battery life.",
                    "Electronics", "wireless headphones product photo", 3394665, 999, 4999, 0.35),
            new Template(List.of(
                    "Amazon Basics Adjustable Phone Stand",
                    "Portronics Adjustable Mobile Stand",
                    "Ubon Foldable Phone Holder",
                    "boAt Multi-Angle Phone Stand",
                    "Zebronics Desktop Mobile Stand"),
                    "Adjustable aluminum stand compatible with all phone sizes.",
                    "Electronics", "phone stand holder desk", 4526428, 249, 899, 0.45),
            new Template(List.of(
                    "Logitech K380 Wireless Keyboard",
                    "Redgear Invador Mechanical Keyboard",
                    "HyperX Alloy FPS Mechanical Keyboard",
                    "Ant Esports MK1400 Mechanical Keyboard",
                    "Cosmic Byte CB-GK-16 RGB Keyboard"),
                    "RGB backlit mechanical keyboard with tactile switches.",
                    "Electronics", "mechanical keyboard product photo", 671629, 1999, 6999, 0.32),
            new Template(List.of(
                    "HP Wireless Mouse X200",
                    "Logitech M235 Wireless Mouse",
                    "Dell WM126 Wireless Mouse",
                    "Zebronics Zeb-Dazzle Wireless Mouse",
                    "Amazon Basics Wireless Mouse"),
                    "Ergonomic wireless mouse with adjustable DPI.",
                    "Electronics", "wireless computer mouse product photo", 2115256, 499, 2499, 0.38),

            new Template(List.of(
                    "Adidas Essentials T-Shirt",
                    "Puma Classic Cotton T-Shirt",
                    "US Polo Assn Crew Neck Tee",
                    "H&M Basic Cotton T-Shirt",
                    "Levi's Graphic Print T-Shirt"),
                    "Breathable 100% cotton t-shirt, available in multiple colors.",
                    "Fashion", "folded cotton t-shirt product photo", 4440576, 349, 1299, 0.55),
            new Template(List.of(
                    "Levi's Trucker Denim Jacket",
                    "Roadster Washed Denim Jacket",
                    "Pepe Jeans Denim Jacket",
                    "Wrangler Classic Denim Jacket"),
                    "Classic washed-denim jacket with a relaxed fit.",
                    "Fashion", "denim jacket product photo", 2344601, 1299, 3999, 0.50),
            new Template(List.of(
                    "Ray-Ban Aviator Sunglasses",
                    "Fastrack UV Protected Sunglasses",
                    "Vincent Chase Wayfarer Sunglasses",
                    "Polaroid Polarized Sunglasses"),
                    "UV-protected polarized sunglasses.",
                    "Fashion", "sunglasses product photo", 2371968, 499, 2999, 0.48),

            new Template(List.of(
                    "Prestige Non-Stick Fry Pan",
                    "Hawkins Futura Non-Stick Pan",
                    "Milton Pro Cook Frying Pan",
                    "Pigeon Non-Stick Fry Pan"),
                    "12-inch non-stick frying pan, dishwasher safe.",
                    "Home & Kitchen", "frying pan kitchen product photo", 11514192, 599, 2499, 0.40),
            new Template(List.of(
                    "Milton Insulated Water Bottle",
                    "Cello Puro Steel Water Bottle",
                    "Borosil Vacuum Insulated Bottle",
                    "AquaFresh Steel Water Bottle"),
                    "Insulated bottle that keeps drinks cold for 24 hours.",
                    "Home & Kitchen", "stainless steel water bottle product photo", 3737800, 249, 899, 0.42),
            new Template(List.of(
                    "Philips LED Desk Lamp",
                    "Wipro LED Study Lamp",
                    "Havells LED Table Lamp",
                    "Syska LED Desk Lamp"),
                    "Dimmable LED lamp with USB charging port.",
                    "Home & Kitchen", "LED desk lamp product photo", 1112598, 599, 2499, 0.36),
            new Template(List.of(
                    "Cello Ceramic Coffee Mug",
                    "Borosil Vision Glass Mug",
                    "Milton Thermosteel Mug",
                    "Home Centre Ceramic Mug"),
                    "350ml ceramic mug, microwave and dishwasher safe.",
                    "Home & Kitchen", "ceramic coffee mug product photo", 805536, 199, 699, 0.50),

            new Template(List.of(
                    "\"Head First Java\" Programming Guide",
                    "\"Clean Code\" by Robert Martin",
                    "\"Cracking the Coding Interview\"",
                    "\"Introduction to Algorithms\" Textbook",
                    "\"Python Crash Course\" Book"),
                    "A beginner-friendly guide to core programming concepts.",
                    "Books", "programming book stack product photo", 4219043, 299, 899, 0.30),
            new Template(List.of(
                    "\"The Alchemist\" by Paulo Coelho",
                    "\"Atomic Habits\" by James Clear",
                    "\"Sapiens\" by Yuval Noah Harari",
                    "\"The Silent Patient\" Thriller Novel"),
                    "A gripping page-turner from a bestselling author.",
                    "Books", "novel book stack product photo", 5009158, 249, 699, 0.28),

            new Template(List.of(
                    "Nike Air Max Sneakers",
                    "Puma Sports Running Shoes",
                    "Adidas Ultraboost Running Shoes",
                    "Asics Gel-Excite Running Shoes",
                    "Skechers Go Run Shoes"),
                    "Lightweight running shoes with cushioned sole for daily training.",
                    "Sports & Fitness", "running shoes pair product photo", 2529157, 1499, 4999, 0.38),
            new Template(List.of(
                    "Boldfit Anti-Skid Yoga Mat",
                    "Strauss Yoga Mat",
                    "Decathlon Yoga Mat",
                    "Reebok Yoga Mat"),
                    "Extra-thick non-slip yoga mat with carrying strap.",
                    "Sports & Fitness", "rolled yoga mat product photo", 7318664, 499, 1499, 0.45),
            new Template(List.of(
                    "Boldfit Resistance Bands Set",
                    "Strauss Resistance Loop Bands",
                    "Decathlon Resistance Bands",
                    "Fitkit Resistance Bands Set"),
                    "Set of 5 resistance bands for home workouts.",
                    "Sports & Fitness", "resistance bands fitness product photo", 8846273, 299, 999, 0.48),
            new Template(List.of(
                    "American Tourister Laptop Backpack",
                    "Wildcraft Travel Backpack",
                    "Skybags Casual Backpack",
                    "HP Odyssey Laptop Backpack"),
                    "Water-resistant backpack with padded laptop compartment.",
                    "Sports & Fitness", "backpack product photo", 265683, 999, 3999, 0.42),

            new Template(List.of(
                    "Nivea Soft Light Moisturizer",
                    "Pond's Super Light Gel Moisturizer",
                    "Lakme Peach Milk Moisturizer",
                    "Cetaphil Daily Moisturizer"),
                    "Lightweight daily moisturizer for all skin types.",
                    "Beauty & Personal Care", "skincare moisturizer jar product photo", 5240623, 199, 799, 0.52),
            new Template(List.of(
                    "Dove Nourishing Shampoo",
                    "Head & Shoulders Anti-Dandruff Shampoo",
                    "Sunsilk Black Shine Shampoo",
                    "Himalaya Herbal Shampoo"),
                    "Sulfate-free herbal shampoo for daily use.",
                    "Beauty & Personal Care", "shampoo bottle product photo", 3735627, 199, 599, 0.50),

            new Template(List.of(
                    "Lego Classic Building Blocks Set",
                    "Funskool Building Blocks Set",
                    "Webby Building Blocks Toy",
                    "Ratna's Building Blocks Set"),
                    "500-piece creative building block set for ages 6+.",
                    "Toys & Games", "colorful building blocks toy", 5435599, 799, 2999, 0.40),
            new Template(List.of(
                    "Hot Wheels Remote Control Car",
                    "Centy Toys RC Car",
                    "Turban Toys Remote Control Racing Car",
                    "Dreamon RC Off-Road Car"),
                    "Rechargeable RC car with high-speed off-road tires.",
                    "Toys & Games", "toy car red product photo", 4491566, 999, 2999, 0.35),

            new Template(List.of(
                    "Lipton Green Tea Bags",
                    "Tetley Green Tea",
                    "Twinings Pure Green Tea",
                    "Organic India Green Tea"),
                    "Pack of 100 organic green tea bags.",
                    "Grocery", "green tea bags product photo", 1380224, 149, 499, 0.33),
            new Template(List.of(
                    "India Gate Basmati Rice 5kg",
                    "Daawat Basmati Rice",
                    "Fortune Basmati Rice",
                    "Kohinoor Basmati Rice"),
                    "Premium long-grain aged basmati rice.",
                    "Grocery", "basmati rice grains product photo", 18328392, 399, 899, 0.22),

            new Template(List.of(
                    "Amazon Basics Car Phone Mount",
                    "Portronics Car Mount Holder",
                    "Spigen Car Phone Mount",
                    "boAt Car Dashboard Mount"),
                    "Dashboard mount compatible with most smartphones.",
                    "Automotive", "smartphone car mount vent", 33488, 299, 999, 0.45),
            new Template(List.of(
                    "Little Trees Black Ice Air Freshener",
                    "Godrej Aer Car Air Freshener",
                    "Areon Premium Car Perfume",
                    "Ambi Pur Car Air Freshener"),
                    "Long-lasting car air freshener, assorted scents.",
                    "Automotive", "car air freshener product photo", 14999946, 99, 349, 0.55),

            new Template(List.of(
                    "Nilkamal Desk Organizer",
                    "Kokuyo Camlin Desk Organizer",
                    "Solo Desk Organizer",
                    "Flipkart SmartBuy Desk Organizer"),
                    "Multi-compartment organizer for pens, files, and stationery.",
                    "Office Supplies", "desk organizer stationery product photo", 30101198, 249, 899, 0.48),
            new Template(List.of(
                    "Post-it Sticky Notes",
                    "Kokuyo Camlin Sticky Notes",
                    "Apsara Sticky Notes Pack",
                    "DocuColor Sticky Notes"),
                    "Pack of 12 sticky note pads in assorted colors.",
                    "Office Supplies", "colorful sticky notes product photo", 3831849, 99, 299, 0.40),

            new Template(List.of(
                    "Van Heusen Formal Shirt",
                    "Allen Solly Slim Fit Shirt",
                    "Peter England Formal Shirt",
                    "Arrow Cotton Formal Shirt"),
                    "Slim-fit formal shirt, easy-iron cotton blend, perfect for office wear.",
                    "Clothing", "men formal dress shirt product photo", 356040, 799, 2499, 0.48),
            new Template(List.of(
                    "Biba Embroidered Kurti",
                    "W for Woman Cotton Kurti",
                    "Global Desi Printed Kurti",
                    "Aurelia Straight Kurti"),
                    "Cotton embroidered kurti with a comfortable relaxed fit.",
                    "Clothing", "woman embroidered kurta ethnic wear", 20791992, 599, 1999, 0.50),
            new Template(List.of(
                    "Nike Dri-FIT Track Pants",
                    "Puma Essential Track Pants",
                    "Adidas Track Pants",
                    "Jockey Track Pants"),
                    "Lightweight joggers with an elastic waistband, ideal for workouts or lounging.",
                    "Clothing", "sweatpants joggers flat lay product photo", 31961165, 499, 1499, 0.46),
            new Template(List.of(
                    "Roadster Hooded Sweatshirt",
                    "Puma Fleece Hoodie",
                    "US Polo Assn Hoodie",
                    "H&M Pullover Hoodie"),
                    "Fleece-lined hoodie with a kangaroo pocket, unisex fit.",
                    "Clothing", "hooded sweatshirt hoodie product photo", 1928078, 899, 2499, 0.44),
            new Template(List.of(
                    "Woodland Wool Sweater",
                    "Allen Solly Pullover Sweater",
                    "US Polo Assn Sweater",
                    "Fabindia Wool Sweater"),
                    "Warm knit sweater for winter, machine washable.",
                    "Clothing", "knitted wool sweater product photo", 17588315, 999, 2999, 0.42),
    };

    @Override
    public void run(String... args) {
        seedUsers();
        seedProducts();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@ecommerce.com")) {
            userRepository.save(User.builder()
                    .fullName("Store Admin")
                    .email("admin@ecommerce.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ROLE_ADMIN)
                    .build());
        }
        if (!userRepository.existsByEmail("user@ecommerce.com")) {
            userRepository.save(User.builder()
                    .fullName("Demo Customer")
                    .email("user@ecommerce.com")
                    .password(passwordEncoder.encode("User@123"))
                    .role(Role.ROLE_USER)
                    .build());
        }
    }

    private void seedProducts() {
        if (productRepository.count() > 0) {
            return;
        }

        boolean pexelsConfigured = pexelsImageService.isConfigured();
        if (pexelsConfigured) {
            log.info("Pexels API key detected — fetching distinct real photos per product.");
        } else {
            log.warn("No PEXELS_API_KEY set — every product of the same type will share one curated "
                    + "photo. Get a free key at https://www.pexels.com/api/ and set PEXELS_API_KEY "
                    + "for a unique real photo per product.");
        }

        Random random = new Random(42);
        int targetCount = 540;
        List<Product> batch = new ArrayList<>();

        Map<Template, List<String>> imagePools = new HashMap<>();
        Map<Template, Integer> cursors = new HashMap<>();

        for (int i = 1; i <= targetCount; i++) {
            Template t = TEMPLATES[random.nextInt(TEMPLATES.length)];
            double price = t.minPrice() + random.nextDouble() * (t.maxPrice() - t.minPrice());
            price = Math.round(price * 100.0) / 100.0;
            double costPrice = Math.round(price * (1 - t.marginPct()) * 100.0) / 100.0;
            int stock = 10 + random.nextInt(190);

            int cursor = cursors.merge(t, 1, Integer::sum) - 1;
            String name = t.nameOptions().get(cursor % t.nameOptions().size());
            String imageUrl = nextImageForTemplate(t, cursor, pexelsConfigured, imagePools);

            Product product = Product.builder()
                    .name(name)
                    .description(t.description())
                    .price(price)
                    .costPrice(costPrice)
                    .category(t.category())
                    .imageUrl(imageUrl)
                    .stock(stock)
                    .build();
            batch.add(product);

            if (batch.size() == 100) {
                productRepository.saveAll(batch);
                batch.clear();
            }
        }
        if (!batch.isEmpty()) {
            productRepository.saveAll(batch);
        }
    }

    private String nextImageForTemplate(Template t, int cursor, boolean pexelsConfigured,
                                         Map<Template, List<String>> imagePools) {
        String fallback = "https://images.pexels.com/photos/" + t.fallbackPexelsId()
                + "/pexels-photo-" + t.fallbackPexelsId() + ".jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop";

        if (!pexelsConfigured) {
            return fallback;
        }

        List<String> pool = imagePools.computeIfAbsent(t,
                key -> pexelsImageService.searchImages(key.searchQuery(), 80));

        if (pool.isEmpty()) {
            return fallback;
        }

        return pool.get(cursor % pool.size());
    }
}
