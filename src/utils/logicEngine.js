// Core Intelligence Engine (Client-Side Version)

export const analyzeSkin = (skinType, lifestyle) => {
    let severityScore = 5; // Base score
    let products = [];
    let lifestyleTips = [];
    let recoveryPath = [];
    let riskFactors = { diet: 0, environment: 0, health: 0 };

    // --- 1. Calculate Severity & Base Recommendations ---

    if (skinType === 'Cystic') {
        severityScore += 3;
        products.push('Benzoyl Peroxide Wash', 'Adapalene Gel');
        recoveryPath = [
            { week: 1, title: 'The Purge', description: 'Skin may get worse before better as impurities surface.' },
            { week: 4, title: 'Stubborn Inflammation', description: 'Deep cysts begin to flatten.' },
            { week: 8, title: 'Clarity', description: 'Active breakouts cease; focus shifts to scarring.' }
        ];
    } else if (skinType === 'Hormonal') {
        severityScore += 2;
        products.push('Salicylic Acid Cleanser', 'Niacinamide Serum');
        recoveryPath = [
            { week: 1, title: 'Balancing Act', description: 'Oil production begins to regulate.' },
            { week: 3, title: 'Cycle Control', description: 'Fewer breakouts during hormonal fluctuations.' },
            { week: 6, title: 'Maintenance', description: 'Skin barrier is strengthened.' }
        ];
    } else if (skinType === 'Comedonal') { // Blackheads
        severityScore += 1;
        products.push('BHA Exfoliant', 'Lightweight Moisturizer');
        recoveryPath = [
            { week: 1, title: 'Unclogging', description: 'Blackheads may appear more prominent as they loosen.' },
            { week: 2, title: 'Resurfacing', description: 'Texture becomes smoother.' },
            { week: 4, title: 'Refinement', description: 'Pores appear smaller and cleaner.' }
        ];
    }

    // --- 2. Bio-Environmental Logic (Constraint-Based) ---

    // ============ DIETARY MATRIX ============
    // High Sugar or Diabetes -> Glycation Defense
    if (lifestyle.sugarIntake > 50 || lifestyle.diabetes) {
        severityScore += 1.5;
        riskFactors.diet += 30;
        lifestyleTips.push('Glycation Alert: Excess sugar hardens collagen. Focus on low-GI foods.');
        products.push('Glycation Defense Serum', 'Carnosine Supplement');
    }

    // Processed Food Frequency
    if (['3-5', '7+'].includes(lifestyle.processedFood)) {
        riskFactors.diet += 20;
        lifestyleTips.push('Inflammation Control: Reduce processed foods to lower systemic inflammation.');
    }

    // Hydration
    if (lifestyle.water < 1.5) {
        severityScore += 0.5;
        riskFactors.diet += 10;
        products.push('Hyaluronic Acid');
        lifestyleTips.push('Hydration Debt: Skin is likely dehydrated. Increase water intake.');
    }

    // ============ ENVIRONMENTAL FACTOR ============
    // Pollution & Outdoor Exposure
    // IF [OutdoorTime=High] AND [Pollution=High] -> "Double Cleansing" and "Antioxidant Serums"
    const isHighPollution = ['High', 'Moderate'].includes(lifestyle.pollution) || lifestyle.pollutedPlaces;
    const isHighOutdoor = (lifestyle.sunlight > 60) || (lifestyle.outdoorRatio > 50);

    if (isHighPollution && isHighOutdoor) {
        severityScore += 1;
        riskFactors.environment += 35;
        products.push('Double Cleansing Oil', 'Antioxidant Serum');
        lifestyleTips.push('Urban Shield: High pollution + outdoor exposure requires double cleansing.');
    }

    // Water pH
    // IF [Water_pH > 7.5] -> Suggest "pH-balancing Toners"
    if (lifestyle.waterPh > 7.5) {
        riskFactors.environment += 15;
        products.push('pH-balancing Toner');
        lifestyleTips.push('Hard Water Detected: Use a toner to restore skin acidity (pH 5.5).');
    }

    // Climate Specifics
    if (lifestyle.climate === 'Arid' || lifestyle.climate === 'Cold') {
        products.push('Ceramide Moisturizer');
    } else if (lifestyle.climate === 'Humid' || lifestyle.climate === 'Tropical') {
        products.push('Gel-based Moisturizer');
    }

    // ============ HEALTH & GENETICS ============
    // Genetic Hierarchy
    const hasGenetics = lifestyle.familyHistory && lifestyle.familyHistory.length > 0 && !lifestyle.familyHistory.includes('None');
    if (hasGenetics) {
        severityScore += 1; // Genetic penalty
        riskFactors.health += 25;
        // Adjust Recovery Path to be more conservative
        recoveryPath = recoveryPath.map(stage => ({
            ...stage,
            week: Math.ceil(stage.week * 1.5), // 50% slower progress expectation
            description: stage.description + ' (Adjusted for genetic resistance)'
        }));
    }

    // Systemic Issues
    if (lifestyle.diabetes) {
        riskFactors.health += 20;
        lifestyleTips.push('Diabetic Skin Care: Skin may heal slower. Avoid harsh physical scrubs.');
    }

    if (lifestyle.hormonal) {
        riskFactors.health += 15;
        products.push('Spearmint Tea (Internal)');
    }

    if (lifestyle.acidity) {
        riskFactors.health += 10;
        lifestyleTips.push('Gut-Skin Axis: Acidity links to rosacea/redness. Consider probiotics.');
    }

    // --- 3. Final Adjustments ---
    severityScore = Math.min(Math.max(severityScore, 1), 10);

    // Normalize Risk Factors for Chart (0-100 scale approx)
    riskFactors.diet = Math.min(riskFactors.diet + (lifestyle.sugarIntake / 2), 100);
    riskFactors.environment = Math.min(riskFactors.environment + (lifestyle.pollution === 'High' ? 30 : 0), 100);
    riskFactors.health = Math.min(riskFactors.health + (hasGenetics ? 20 : 0), 100);

    return {
        severityScore,
        products: [...new Set(products)], // Unique products
        lifestyleTips,
        recoveryPath,
        riskFactors
    };
};

export const analyzeRecovery = (prevSeverity, dailyInput) => {
    let newScore = prevSeverity;
    let dailyTips = [];
    let factorFeedback = []; // { factor, status, message }
    let progressStatus = 'Stable';

    // 1. Progress Adjustment
    if (dailyInput.progress === 'Better') {
        newScore = Math.max(1, newScore - 1);
        progressStatus = 'Improving';
        factorFeedback.push({ factor: 'Skin Condition', status: 'good', message: 'Visibly improving. Routine is working.' });
    } else if (dailyInput.progress === 'Worse') {
        newScore = Math.min(10, newScore + 1);
        progressStatus = 'Regression';
        factorFeedback.push({ factor: 'Skin Condition', status: 'bad', message: 'Flare-up detected. Focus on barrier repair.' });
    } else {
        factorFeedback.push({ factor: 'Skin Condition', status: 'neutral', message: 'Stable. Consistency is key.' });
    }

    // 2. Daily Lifestyle Impact & Specific Feedback

    // Sleep Analysis
    if (dailyInput.sleep < 7) {
        factorFeedback.push({ factor: 'Sleep', status: 'bad', message: 'Sleep Debt (<7h): Cortisol may spike inflammation.' });
        dailyTips.push('Low Sleep: Use a cooling mask to reduce puffiness.');
    } else {
        factorFeedback.push({ factor: 'Sleep', status: 'good', message: 'Optimal regeneration time achieved.' });
    }

    // Hydration Analysis
    if (dailyInput.water < 2) {
        factorFeedback.push({ factor: 'Hydration', status: 'bad', message: 'Dehydrated: Skin barrier efficiency reduced.' });
        dailyTips.push('Dehydration: Double up on moisturizer.');
    } else {
        factorFeedback.push({ factor: 'Hydration', status: 'good', message: 'Well hydrated. Elastin supported.' });
    }

    // Stress Analysis
    if (dailyInput.stress > 6) {
        factorFeedback.push({ factor: 'Stress', status: 'warning', message: 'High Cortisol levels detected.' });
        dailyTips.push('High Stress: Consider a calming tea or meditation before bed.');
    } else {
        factorFeedback.push({ factor: 'Stress', status: 'good', message: 'Low stress environment.' });
    }

    // New: Sugar Analysis (Optional check if provided)
    if (dailyInput.sugar !== undefined) {
        if (dailyInput.sugar > 40) {
            factorFeedback.push({ factor: 'Diet (Sugar)', status: 'bad', message: 'Glycation Risk: High sugar intake today.' });
            dailyTips.push('Sugar Spike: Drink green tea to combat glycation.');
        } else {
            factorFeedback.push({ factor: 'Diet (Sugar)', status: 'good', message: 'Low glycemic impact today.' });
        }
    }

    // 3. Adherence Check
    if (!dailyInput.adherence) {
        newScore = Math.min(10, newScore + 0.5);
        factorFeedback.push({ factor: 'Routine Adherence', status: 'warning', message: 'Missed routine steps.' });
        dailyTips.push('Consistency is key. Try to get back on track tonight.');
    } else {
        factorFeedback.push({ factor: 'Routine Adherence', status: 'good', message: 'Protocol followed perfectly.' });
    }

    return {
        newSeverity: newScore,
        progressStatus,
        dailyTips,
        factorFeedback // New structured output
    };
};
