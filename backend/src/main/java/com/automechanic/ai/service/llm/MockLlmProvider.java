package com.automechanic.ai.service.llm;

import com.automechanic.ai.dto.ChatResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
public class MockLlmProvider implements LlmProvider {

    private static final List<String> APPROVED_TOPICS = Arrays.asList(
            "moteur", "engine", "bruit", "noise", "son", "siffle", "grince", "vibre", "claque",
            "frein", "brake", "plaquette", "disque", "suspension", "amortisseur", "direction",
            "transmission", "boite", "vitesse", "gearbox", "embrayage", "clutch", "cardan",
            "huile", "oil", "liquide", "refroidissement", "freinage", "direction", "essuie",
            "climatisation", "clim", "ac", "chauffage", "batterie", "battery", "alternateur",
            "demarre", "démarrage", "bougie", "bobine", "capteur", "sensor", "voyant", "tableau",
            "bord", "pneu", "tire", "pression", "crevaison", "consommation", "carburant", "essence",
            "diesel", "fap", "filtre", "courroie", "distribution", "radiateur", "surchauffe",
            "fumee", "fumée", "echappement", "exhaust", "mecanique", "mécanique", "entretien",
            "revision", "révision", "vidange", "bougie", "allumage", "injecteur", "turbo", "panne"
    );

    @Override
    public ChatResponse generateResponse(String brandName, String carModelName, String userMessage) {
        String lowerMessage = userMessage.toLowerCase().trim();

        // 1. Audit topic relevance
        boolean isApproved = APPROVED_TOPICS.stream().anyMatch(lowerMessage::contains);

        if (!isApproved) {
            return ChatResponse.builder()
                    .replyText("Je suis spécialisé uniquement dans la mécanique automobile.")
                    .probableDiagnostic("Hors sujet")
                    .possibleCause("Aucune relation avec la mécanique automobile.")
                    .urgencyLevel("AUCUN")
                    .checkAdvice("Veuillez formuler une question concernant la mécanique, les pannes ou l'entretien de votre véhicule.")
                    .concernedParts("Aucune")
                    .maintenanceRecommendation("N/A")
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        // 2. Specialized Rule Engine based on message keywords
        String diagnostic;
        String cause;
        String urgency;
        String advice;
        String parts;
        String recommendation;
        String text;

        if (lowerMessage.contains("bruit") || lowerMessage.contains("métallique") || lowerMessage.contains("claque") || lowerMessage.contains("grince")) {
            diagnostic = "Frottement métallique ou jeu mécanique anormal";
            cause = "Usure prononcée des plaquettes de frein (métal contre disque) ou jeu dans les biellettes de barre stabilisatrice/suspension.";
            urgency = "ÉLEVÉ";
            advice = "Inspectez visuellement l'épaisseur des plaquettes de frein à travers les jantes et vérifiez le serrage des fixations de suspension.";
            parts = "Plaquettes de frein, Disques de frein, Rotules de direction, Silentblocs de suspension";
            recommendation = "Évitez de rouler sur de longues distances et faites contrôler le train avant de votre " + brandName + " " + carModelName + " par un professionnel.";
            text = "Après analyse de vos symptômes de bruit métallique sur votre " + brandName + " " + carModelName + ", il semble que vous soyez en présence d'un frottement mécanique. Si le bruit survient au freinage, remplacez d'urgence vos plaquettes de frein avant qu'elles n'endommagent les disques.";
        } else if (lowerMessage.contains("huile") || lowerMessage.contains("vidange") || lowerMessage.contains("consommation")) {
            diagnostic = "Niveau d'huile bas ou dégradation du lubrifiant";
            cause = "Consommation naturelle d'huile moteur par le bloc thermique ou fuite au niveau du joint de carter / joint de cache-culbuteurs.";
            urgency = "MOYEN";
            advice = "Garez votre " + brandName + " " + carModelName + " sur un sol plat, attendez que le moteur refroidisse et vérifiez la jauge manuelle d'huile.";
            parts = "Huile moteur, Filtre à huile, Joint de vidange, Capteur de pression d'huile";
            recommendation = "Faites l'appoint immédiatement avec l'huile recommandée pour votre modèle et prévoyez une vidange complète si la périodicité est dépassée.";
            text = "Pour votre " + brandName + " " + carModelName + ", le maintien d'une bonne lubrification est crucial. Assurez-vous d'utiliser une huile conforme aux normes constructeur pour éviter d'encrasser les composants mécaniques sensibles.";
        } else if (lowerMessage.contains("frein") || lowerMessage.contains("freinage") || lowerMessage.contains("mou")) {
            diagnostic = "Baisse de pression hydraulique ou usure des garnitures";
            cause = "Présence de bulles d'air dans le circuit de freinage, fuite de liquide de frein ou usure limite des plaquettes.";
            urgency = "ÉLEVÉ";
            advice = "Contrôlez le niveau du réservoir de liquide de frein sous le capot. Si la pédale s'enfonce anormalement, ne prenez pas la route.";
            parts = "Plaquettes de frein, Étriers de frein, Maître-cylindre, Liquide de frein (DOT 4/5.1)";
            recommendation = "Purgez le système de freinage et remplacez les éléments défectueux dans un atelier spécialisé.";
            text = "Alerte de sécurité sur votre " + brandName + " " + carModelName + " : les freins sont un organe vital. Une pédale molle ou une perte d'efficacité nécessite un remorquage immédiat vers un atelier mécanique.";
        } else if (lowerMessage.contains("batterie") || lowerMessage.contains("demarr") || lowerMessage.contains("démarre") || lowerMessage.contains("alternateur")) {
            diagnostic = "Faiblesse du circuit de démarrage ou alternateur défectueux";
            cause = "Batterie 12V en fin de vie, cosses de batterie sulfatées ou alternateur ne rechargeant plus la batterie en roulant.";
            urgency = "MOYEN";
            advice = "Mesurez la tension de la batterie avec un voltmètre (moteur éteint : doit être > 12.6V, moteur allumé : doit être ~14V).";
            parts = "Batterie 12V AGM/EFB, Démarreur, Alternateur, Courroie d'accessoire";
            recommendation = "Nettoyez les cosses de batterie, rechargez-la avec un chargeur intelligent, ou remplacez la batterie si elle a plus de 4 ans.";
            text = "Le circuit électrique de votre " + brandName + " " + carModelName + " est très sollicité. Si le démarreur tourne lentement ou émet un clic-clic, la batterie est déchargée. Si le voyant batterie reste allumé moteur tournant, c'est l'alternateur.";
        } else if (lowerMessage.contains("voyant") || lowerMessage.contains("tableau") || lowerMessage.contains("allume")) {
            diagnostic = "Code défaut stocké dans le calculateur moteur (MIL)";
            cause = "Dysfonctionnement électronique détecté par les capteurs (sonde lambda, capteur PMH, injecteur, FAP).";
            urgency = "MOYEN";
            advice = "Branchez une interface de diagnostic OBD2 sur la prise de votre " + brandName + " " + carModelName + " pour lire le code défaut exact (ex: P0300).";
            parts = "Calculateur moteur, Capteurs électroniques, Sonde Lambda, Bougies d'allumage";
            recommendation = "Si le voyant est orange fixe, vous pouvez rouler prudemment jusqu'au garage. S'il clignote ou est rouge, coupez immédiatement le moteur.";
            text = "Un voyant moteur allumé sur le tableau de bord de votre " + brandName + " " + carModelName + " indique qu'un capteur a détecté une anomalie de combustion ou de pollution. Un passage à la valise diagnostic est indispensable.";
        } else {
            // General mechanical answer fallback
            diagnostic = "Usure générale ou anomalie de fonctionnement";
            cause = "Composant mécanique fatigué ou entretien périodique à effectuer.";
            urgency = "FAIBLE";
            advice = "Vérifiez le carnet d'entretien numérique ou papier de votre véhicule pour contrôler les échéances.";
            parts = "Filtres (Air, Habitacle, Carburant), Fluides divers";
            recommendation = "Procédez à une inspection visuelle générale sous le capot et le châssis.";
            text = "Votre question concernant la " + brandName + " " + carModelName + " rentre bien dans le cadre de l'entretien courant. Veillez à suivre le plan de maintenance recommandé par le constructeur pour préserver sa fiabilité.";
        }

        return ChatResponse.builder()
                .probableDiagnostic(diagnostic)
                .possibleCause(cause)
                .urgencyLevel(urgency)
                .checkAdvice(advice)
                .concernedParts(parts)
                .maintenanceRecommendation(recommendation)
                .replyText(text)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
