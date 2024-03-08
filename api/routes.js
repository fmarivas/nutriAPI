const express = require('express');
const router = express.Router();
const axios = require('axios');
const NutritionUtils = require('../utils/nutritionUtils');

function getCmUnit(value) {
	if (value%1 === 0 && value >= 100) {
		return true;
	}else{
		return false
	}
}

function convertToMetric(unit, weight, height) {
    // Verifica se a unidade é imperial e realiza a conversão se necessário
    if (unit.toLowerCase() === 'imperial') {
        // Conversão de peso de libras para quilogramas (1 lb = 0.453592 kg)
        weight = weight * 0.453592;
        // Conversão de altura de polegadas para centímetros (1 in = 2.54 cm)
        height = height * 2.54;
    }

    return { weight, height };
}

router.get('/', (req, res) => {
    res.send('Bem-vindo à NutriAPI!');
});

router.post('/health-stats', (req, res) => {
	//imperial unit: weight in pounds, height in inches		
	//metric unit: weight in KG, height in meter
	const unit = req.body.unit;
	
	const gender = req.body.gender
	const activityLevel = req.body.activity
	const age = parseInt(req.body.age)
	let weight = parseFloat(req.body.weight);
	let height = parseFloat(req.body.height);
	
	// Valida e converte automaticamente as unidades
	const convertedValues = convertToMetric(unit, weight, height);
	weight = convertedValues.weight;
	height = convertedValues.height;	
	
	if (!height || !weight || !unit || !gender || !activityLevel || !age) {
		return res.status(400).json({ error: 'Unit, Gender, Age, Height, Weight, Activity are required' });
	}
	if (!getCmUnit(height)) {
		return res.status(400).json({ error: 'Height must be in centimeter' });
	}
	
	const idealWeight = NutritionUtils.idealWeight(gender, height)
	const BMI = NutritionUtils.calculateBMI(weight, height);
	const TDEE = NutritionUtils.calculateTDEE(gender, age, weight, height, activityLevel)
	
	res.json({idealWeight, BMI, 'Macronutrients': TDEE});
});

router.post('/body-fat-percentage', (req , res) =>{
	const gender = req.body.gender;
	const weight = parseFloat(req.body.weight);
	const neck = parseFloat(req.body.neck);
	const waist = parseFloat(req.body.waist);
	const height = parseFloat(req.body.height);
	const hip = parseFloat(req.body.hip);
	
	if(!gender || !weight || !neck || !waist){
		return res.status(400).json({error: 'Gender, Weight, Neck and Waist are required'})
	}
	
	if (!getCmUnit(height)) {
		return res.status(400).json({ error: 'Height must be in centimeter' });
	}
	
	if(gender.toLowerCase() === 'female' && !hip){
		return res.status(400).json({ error: 'Hip is required' });
	}
	
	const BF = NutritionUtils.calculateBF(gender, height, weight, neck, waist, hip)
	
	res.json({BF})
})

router.get('/unit-conversion/kj-to-kcal', (req, res) => {
    const kjValue = parseFloat(req.query.value);
	
	if(!kjValue){
		return res.status(400).json({error: 'The KJ value is required'})
	}
	
    const kcalValue = NutritionUtils.convertKjToKcal(kjValue);
	
    res.json({ kj: kjValue, kcal: kcalValue });
});

router.get('/unit-conversion/sodium-to-salt', (req, res) => {
    const sodiumValue = parseFloat(req.query.value);
	
	if(!sodiumValue){
		return res.status(400).json({error: 'Sodium value is required'})
	}
	
    const saltValue = NutritionUtils.convertSodiumToSalt(sodiumValue);
	
    res.json({ 'sodium(mg)': sodiumValue, 'salt(g)': saltValue });
});


router.post('/meal-planner', (req , res) =>{
	
})

router.get('/food-substitution', (req, res) =>{
	// Descrição: Este endpoint pode sugerir alternativas mais saudáveis 
	// para alimentos considerados menos saudáveis, com base em critérios 
	// nutricionais.

	// Exemplo de uso: Um usuário pode solicitar sugestões de substituição 
	// para um alimento específico, como "batata frita", e receber uma lista 
	// de opções mais saudáveis, como "batata assada" ou "palitos de legumes".	
})

router.get('/food-info/:food_name', async (req, res) => {
    const foodName = req.params.food_name;
    try {
        const foodInfo = await NutritionUtils.getFoodInfo(foodName);
        res.json(foodInfo);
    } catch (error) {
        console.error('Error fetching food info:', error.message);
        res.status(500).json({ error: 'Failed to fetch food info' });
    }
});


module.exports = router;