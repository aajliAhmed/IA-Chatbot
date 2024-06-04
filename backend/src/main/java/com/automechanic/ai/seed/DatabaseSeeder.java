package com.automechanic.ai.seed;

import com.automechanic.ai.entity.*;
import com.automechanic.ai.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final BrandRepository brandRepository;
    private final CarModelRepository carModelRepository;
    private final VehicleMechanicalInfoRepository mechanicalInfoRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedUsers();
        if (brandRepository.count() == 0) {
            seedBrandsAndModels();
        }
    }

    private void seedUsers() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .email("admin@automechanic.ai")
                    .role("ROLE_ADMIN")
                    .build();
            userRepository.save(admin);
            log.info("Seeded admin user: admin / admin123");
        }
        if (!userRepository.existsByUsername("user")) {
            User user = User.builder()
                    .username("user")
                    .password(passwordEncoder.encode("user123"))
                    .email("user@gmail.com")
                    .role("ROLE_USER")
                    .build();
            userRepository.save(user);
            log.info("Seeded standard user: user / user123");
        }
    }

    private void seedBrandsAndModels() {
        log.info("Starting database seeding for brands and car models...");

        // Define Brand Map
        Map<String, List<String>> brandModelsMap = new LinkedHashMap<>();
        brandModelsMap.put("Toyota", Arrays.asList("Corolla", "Yaris", "Camry"));
        brandModelsMap.put("BMW", Arrays.asList("Série 3", "Série 5", "X5"));
        brandModelsMap.put("Mercedes", Arrays.asList("Classe A", "Classe C", "Classe E"));
        brandModelsMap.put("Audi", Arrays.asList("A3", "A4", "Q5"));
        brandModelsMap.put("Renault", Arrays.asList("Clio", "Megane", "Captur"));
        brandModelsMap.put("Peugeot", Arrays.asList("208", "308", "3008"));
        brandModelsMap.put("Volkswagen", Arrays.asList("Golf", "Polo", "Tiguan"));
        brandModelsMap.put("Hyundai", Arrays.asList("i30", "Tucson", "Kona"));
        brandModelsMap.put("Kia", Arrays.asList("Ceed", "Sportage", "Rio"));
        brandModelsMap.put("Ford", Arrays.asList("Fiesta", "Focus", "Kuga"));

        for (Map.Entry<String, List<String>> entry : brandModelsMap.entrySet()) {
            Brand brand = Brand.builder().name(entry.getKey()).build();
            brand = brandRepository.save(brand);

            for (String modelName : entry.getValue()) {
                CarModel model = CarModel.builder()
                        .name(modelName)
                        .brand(brand)
                        .build();
                model = carModelRepository.save(model);

                // Create custom specs depending on the model/brand for maximum realism!
                VehicleMechanicalInfo info = createMockSpecsForModel(model);
                mechanicalInfoRepository.save(info);
            }
        }
        log.info("Database seeding successfully completed!");
    }

    private VehicleMechanicalInfo createMockSpecsForModel(CarModel model) {
        String modelName = model.getName();
        String brandName = model.getBrand().getName();

        VehicleMechanicalInfo.VehicleMechanicalInfoBuilder builder = VehicleMechanicalInfo.builder()
                .carModel(model);

        // Tailor specs dynamically based on model characteristics
        if (brandName.equals("Toyota")) {
            builder.engineType("4-Cylindres en Ligne (Hybride VVT-i)")
                   .fuelType("Essence / Hybride")
                   .oilType("0W-20 Synthétique")
                   .oilCapacity("4.2 Litres")
                   .transmission(modelName.equals("Camry") ? "Automatique 8 rapports" : "e-CVT Variation Continue")
                   .horsepower(modelName.equals("Corolla") ? "140 ch" : (modelName.equals("Yaris") ? "116 ch" : "218 ch"))
                   .tirePressure("2.3 bar (Avant) / 2.2 bar (Arrière)")
                   .recommendedBattery("12V 45Ah AGM (Auxiliaire) + Pack Batterie Hybride Li-Ion")
                   .averageConsumption(modelName.equals("Yaris") ? "3.8 L/100km" : (modelName.equals("Corolla") ? "4.5 L/100km" : "5.3 L/100km"))
                   .maintenanceFrequency("Tous les 15 000 km ou 1 an")
                   .commonProblems("Usure prématurée des freins arrières (dû au freinage régénératif peu sollicité), bugs mineurs du système multimédia, décharge de la batterie 12V auxiliaire si véhicule immobilisé.")
                   .sensitiveParts("Batterie auxiliaire 12V, disques de freins arrières, capteur de débit d'air (MAF).");
        } else if (brandName.equals("BMW")) {
            builder.engineType("TwinPower Turbo 4/6 Cylindres")
                   .fuelType("Diesel (Micro-hybride)")
                   .oilType("5W-30 LL-04 Fully Synthetic")
                   .oilCapacity("5.5 Litres")
                   .transmission("Automatique Steptronic 8 rapports (ZF)")
                   .horsepower(modelName.equals("Série 3") ? "190 ch" : (modelName.equals("Série 5") ? "286 ch" : "340 ch"))
                   .tirePressure("2.4 bar (Avant) / 2.6 bar (Arrière)")
                   .recommendedBattery("12V 90Ah AGM Haute Performance")
                   .averageConsumption(modelName.equals("Série 3") ? "5.1 L/100km" : (modelName.equals("Série 5") ? "5.8 L/100km" : "7.2 L/100km"))
                   .maintenanceFrequency("Tous les 25 000 km ou 2 ans (Indicateur CBS)")
                   .commonProblems("Encrassement de la vanne EGR et du filtre à particules (FAP) sur trajets urbains, usure des coussinets de suspension, fuites légères de liquide de refroidissement au niveau du boîtier de thermostat.")
                   .sensitiveParts("Vanne EGR, refroidisseur EGR, thermostat, bras de suspension en aluminium.");
        } else if (brandName.equals("Renault") || brandName.equals("Peugeot")) {
            builder.engineType("3-Cylindres Turbo (PureTech / TCe)")
                   .fuelType("Essence Sans Plomb 95")
                   .oilType("0W-30 PSA B71 2312 / 5W-30 RN0720")
                   .oilCapacity("3.6 Litres")
                   .transmission("Manuelle 6 vitesses / Automatique EAT8")
                   .horsepower(modelName.contains("208") || modelName.contains("Clio") ? "100 ch" : "130 ch")
                   .tirePressure("2.2 bar (Avant) / 2.0 bar (Arrière)")
                   .recommendedBattery("12V 60Ah EFB (Start & Stop)")
                   .averageConsumption("5.4 L/100km")
                   .maintenanceFrequency("Tous les 20 000 km ou 1 an")
                   .commonProblems("Dégradation de la courroie de distribution humide (PureTech baignant dans l'huile), encrassement des soupapes d'admission (moteur injection directe), usure prématurée des amortisseurs avants.")
                   .sensitiveParts("Courroie de distribution humide, crépine de pompe à huile, électrovanne de turbo.");
        } else {
            // General specs fallback
            builder.engineType("4-Cylindres en Ligne Turbocompressé")
                   .fuelType("Essence / Diesel")
                   .oilType("5W-30 Synthétique standard")
                   .oilCapacity("4.5 Litres")
                   .transmission("Manuelle 6 rapports / Robotisée double embrayage")
                   .horsepower("150 ch")
                   .tirePressure("2.3 bar (Toutes roues)")
                   .recommendedBattery("12V 70Ah AGM")
                   .averageConsumption("6.1 L/100km")
                   .maintenanceFrequency("Tous les 20 000 km ou 1 an")
                   .commonProblems("Bruits de grincement de la suspension avant, usure prématurée des bobines d'allumage, perte de pression dans le circuit de suralimentation.")
                   .sensitiveParts("Bobines d'allumage, biellettes de barre stabilisatrice, bougies d'allumage.");
        }

        return builder.build();
    }
}
