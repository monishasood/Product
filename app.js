// ===== Ultra-Premium FreshPlate - Complete Feature Set =====

// App State
let ingredients = [];
let currentScreen = 'home';
let userStats = {
    moneySaved: 0,
    itemsSaved: 0,
    recipesCooked: 0,
    totalPoints: 0
};
let currentPhoto = null;

// Points System
const POINTS = {
    ADD_INGREDIENT: 5,
    ADD_PHOTO: 10,
    USE_EXPIRING: 15,
    COOK_RECIPE: 20,
    SAVE_ITEM: 10
};

// Real food images from Unsplash
const FOOD_IMAGES = {
    // Vegetables
    'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300',
    'carrots': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300',
    'broccoli': 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300',
    'tomatoes': 'https://images.unsplash.com/photo-1546470427-3d55a84d14a4?w=300',
    'cucumber': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=300',
    'bell peppers': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300',
    'onions': 'https://images.unsplash.com/photo-1587135951346-a3af9cfde7e5?w=300',
    'potatoes': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300',
    'mushrooms': 'https://images.unsplash.com/photo-1565984500691-a25be788df44?w=300',
    'lettuce': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=300',
    
    // Proteins
    'eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300',
    'chicken breast': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300',
    'beef': 'https://images.unsplash.com/photo-1588347818036-8e6d6a3c45cf?w=300',
    'salmon': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300',
    'shrimp': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=300',
    'bacon': 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=300',
    
    // Dairy
    'milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
    'cheddar cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300',
    'feta cheese': 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=300',
    'parmesan': 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=300',
    'butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300',
    'yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300',
    
    // Grains
    'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
    'pasta': 'https://images.unsplash.com/photo-1551462147-37bd3c02a58a?w=300',
    'rice': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=300',
    'quinoa': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300',
    
    // Fruits
    'apples': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300',
    'bananas': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300',
    'strawberries': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300',
    'lemons': 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=300',
    'avocado': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300'
};

// Recipe images
const RECIPE_IMAGES = {
    1: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',  // Omelet
    2: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400',  // Chicken Stir Fry
    3: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',  // Scrambled Eggs
    4: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',  // Veggie Pasta
    5: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',  // Rice Bowl
    6: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',  // Salad
    7: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',  // Omelet
    8: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',  // Caesar Salad
    9: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',  // Soup
    10: 'https://images.unsplash.com/photo-1476124369491-b79c27f8dd46?w=400', // Risotto
    11: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400', // Greek Salad
    12: 'https://images.unsplash.com/photo-1618040996337-2b9a49624318?w=400', // Quesadilla
    13: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', // Fried Rice
    14: 'https://images.unsplash.com/photo-1476718406163-a27953a46c24?w=400', // Soup
    15: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400'  // Avocado Toast
};

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
    }, 2000);
    
    loadData();
    setDefaultDate();
    updateAllViews();
    checkAchievements();
});

// ===== Data Persistence =====
function loadData() {
    const storedIngredients = localStorage.getItem('freshplate_ultra_ingredients');
    if (storedIngredients) {
        try {
            ingredients = JSON.parse(storedIngredients);
        } catch (e) {
            ingredients = [];
        }
    }
    
    const storedStats = localStorage.getItem('freshplate_ultra_stats');
    if (storedStats) {
        try {
            userStats = JSON.parse(storedStats);
        } catch (e) {
            userStats = { moneySaved: 0, itemsSaved: 0, recipesCooked: 0, totalPoints: 0 };
        }
    }
}

function saveData() {
    localStorage.setItem('freshplate_ultra_ingredients', JSON.stringify(ingredients));
    localStorage.setItem('freshplate_ultra_stats', JSON.stringify(userStats));
    updateAllViews();
}

// ===== Screen Navigation =====
function switchScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`${screenName}-screen`).classList.add('active');
    
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-screen="${screenName}"]`).classList.add('active');
    
    currentScreen = screenName;
    
    if (screenName === 'fridge') updateIngredientList();
    else if (screenName === 'recipes') updateRecipeList();
    else if (screenName === 'home') updateHomeView();
    else if (screenName === 'insights') updateInsightsView();
}

// ===== Date Utilities =====
function setDefaultDate() {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    document.getElementById('expiry-input').min = today.toISOString().split('T')[0];
    document.getElementById('expiry-input').value = nextWeek.toISOString().split('T')[0];
}

function getDaysUntilExpiry(expirationDate) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const expiry = new Date(expirationDate);
    expiry.setHours(0, 0, 0, 0);
    return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
}

function getExpiryStatus(expirationDate) {
    const days = getDaysUntilExpiry(expirationDate);
    
    if (days < 0) {
        return { class: 'expiry-danger', text: 'EXPIRED' };
    } else if (days <= 2) {
        return { class: 'expiry-danger', text: 'USE NOW' };
    } else if (days <= 5) {
        return { class: 'expiry-warning', text: 'SOON' };
    } else {
        return { class: 'expiry-success', text: 'FRESH' };
    }
}

// ===== Photo Upload =====
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentPhoto = e.target.result;
            document.getElementById('photo-preview').src = e.target.result;
            document.getElementById('photo-placeholder').classList.add('hidden');
            document.getElementById('photo-preview-container').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function removePhoto(event) {
    event.stopPropagation();
    currentPhoto = null;
    document.getElementById('photo-placeholder').classList.remove('hidden');
    document.getElementById('photo-preview-container').classList.add('hidden');
    document.getElementById('photo-input').value = '';
}

// ===== Ingredient Management =====
function openAddModal() {
    document.getElementById('add-modal').classList.add('active');
    setTimeout(() => {
        document.getElementById('ingredient-name').focus();
    }, 300);
}

function closeAddModal() {
    document.getElementById('add-modal').classList.remove('active');
    document.getElementById('add-ingredient-form').reset();
    currentPhoto = null;
    document.getElementById('photo-placeholder').classList.remove('hidden');
    document.getElementById('photo-preview-container').classList.add('hidden');
    setDefaultDate();
}

function handleAddIngredient(event) {
    event.preventDefault();
    
    const name = document.getElementById('ingredient-name').value;
    const quantity = document.getElementById('quantity-input').value;
    const status = document.getElementById('status-input').value;
    const expirationDate = document.getElementById('expiry-input').value;
    
    // Calculate points
    let points = POINTS.ADD_INGREDIENT;
    if (currentPhoto) {
        points += POINTS.ADD_PHOTO;
    }
    
    const newIngredient = {
        id: Date.now(),
        name: name,
        quantity: quantity,
        status: status,
        expirationDate: expirationDate,
        addedDate: new Date().toISOString(),
        photo: currentPhoto,
        used: false
    };
    
    ingredients.push(newIngredient);
    userStats.totalPoints += points;
    saveData();
    closeAddModal();
    
    // Show success with points
    showToast('Success!', `+${points} points! Ingredient added`, 'success');
    
    setTimeout(() => {
        switchScreen('fridge');
    }, 500);
}

function deleteIngredient(id) {
    if (confirm('Remove this ingredient?')) {
        const ingredient = ingredients.find(i => i.id === id);
        
        const daysLeft = getDaysUntilExpiry(ingredient.expirationDate);
        if (daysLeft >= 0) {
            const estimatedValue = 5;
            userStats.moneySaved += estimatedValue;
            userStats.itemsSaved += 1;
            userStats.totalPoints += POINTS.SAVE_ITEM;
            
            if (daysLeft <= 3) {
                userStats.totalPoints += POINTS.USE_EXPIRING;
            }
        }
        
        ingredients = ingredients.filter(item => item.id !== id);
        saveData();
        showToast('Great!', `Item removed! You saved $5`, 'success');
        checkAchievements();
    }
}

// ===== Ingredient List View =====
function updateIngredientList() {
    const container = document.getElementById('ingredient-list');
    const emptyState = document.getElementById('fridge-empty');
    const progressSection = document.getElementById('fridge-progress');
    
    if (ingredients.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        progressSection.style.display = 'none';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    progressSection.style.display = 'block';
    
    updateFreshnessScore();
    
    // Apply filters
    const statusFilter = document.getElementById('status-filter').value;
    const sortBy = document.getElementById('sort-filter').value;
    
    let filtered = [...ingredients];
    if (statusFilter !== 'all') {
        filtered = filtered.filter(i => i.status === statusFilter);
    }
    
    // Sort
    if (sortBy === 'expiry') {
        filtered.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
    } else if (sortBy === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'added') {
        filtered.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
    }
    
    container.innerHTML = filtered.map(item => {
        const status = getExpiryStatus(item.expirationDate);
        const days = getDaysUntilExpiry(item.expirationDate);
        
        let daysText = '';
        if (days < 0) {
            daysText = `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`;
        } else if (days === 0) {
            daysText = 'Expires today!';
        } else {
            daysText = `${days} day${days !== 1 ? 's' : ''} left`;
        }
        
        // Get image
        const itemImage = item.photo || FOOD_IMAGES[item.name.toLowerCase()] || null;
        
        return `
            <div class="ingredient-card">
                ${itemImage 
                    ? `<img src="${itemImage}" alt="${item.name}" class="ingredient-photo">`
                    : `<div class="ingredient-photo-placeholder">🍽️</div>`
                }
                <div class="ingredient-info">
                    <div class="ingredient-header">
                        <h4 class="ingredient-name">${item.name}</h4>
                        <span class="status-badge status-${item.status}">${item.status === 'raw' ? 'Fresh' : 'Cooked'}</span>
                    </div>
                    <div class="ingredient-meta">${item.quantity} • ${daysText}</div>
                    <div class="ingredient-actions">
                        <span class="expiry-badge ${status.class}">${status.text}</span>
                        <button class="btn btn-danger" onclick="deleteIngredient(${item.id})">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateFreshnessScore() {
    if (ingredients.length === 0) return;
    
    const freshItems = ingredients.filter(i => getDaysUntilExpiry(i.expirationDate) > 5).length;
    const score = Math.round((freshItems / ingredients.length) * 100);
    
    document.getElementById('freshness-score').textContent = `${score}%`;
    document.getElementById('freshness-fill').style.width = `${score}%`;
}

// ===== Recipe Matching =====
function matchRecipes() {
    if (ingredients.length === 0) return [];
    
    const userIngredients = ingredients.map(i => i.name.trim().toLowerCase());
    
    return RECIPES_DATABASE.map(recipe => {
        const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());
        
        const matchedIngredients = recipeIngredients.filter(ing => 
            userIngredients.some(userIng => 
                userIng.includes(ing) || ing.includes(userIng)
            )
        );
        
        const matchPercentage = Math.round(
            (matchedIngredients.length / recipeIngredients.length) * 100
        );
        
        const missingIngredients = recipeIngredients.filter(ing => 
            !userIngredients.some(userIng => 
                userIng.includes(ing) || ing.includes(userIng)
            )
        );
        
        const usesExpiringItems = matchedIngredients.some(matched => {
            const matchingIngredient = ingredients.find(i => 
                i.name.toLowerCase().includes(matched)
            );
            return matchingIngredient && getDaysUntilExpiry(matchingIngredient.expirationDate) <= 3;
        });
        
        return {
            ...recipe,
            matchPercentage,
            matchedCount: matchedIngredients.length,
            missingIngredients,
            usesExpiringItems
        };
    }).filter(r => r.matchPercentage > 0);
}

function sortRecipes(recipes, filterBy) {
    const sorted = [...recipes];
    
    if (filterBy === 'expiring') {
        return sorted.filter(r => r.usesExpiringItems)
            .sort((a, b) => b.matchPercentage - a.matchPercentage);
    } else if (filterBy === 'quick') {
        return sorted.filter(r => parseInt(r.time) <= 20)
            .sort((a, b) => b.matchPercentage - a.matchPercentage);
    } else {
        return sorted.sort((a, b) => {
            if (a.usesExpiringItems && !b.usesExpiringItems) return -1;
            if (!a.usesExpiringItems && b.usesExpiringItems) return 1;
            return b.matchPercentage - a.matchPercentage;
        });
    }
}

// ===== Recipe List View =====
function updateRecipeList() {
    const container = document.getElementById('recipe-list');
    const emptyState = document.getElementById('recipes-empty');
    const statsSection = document.getElementById('recipe-stats');
    
    const matchedRecipes = matchRecipes();
    
    if (matchedRecipes.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        statsSection.style.display = 'none';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    statsSection.style.display = 'flex';
    
    const perfectMatches = matchedRecipes.filter(r => r.matchPercentage === 100).length;
    document.getElementById('total-recipes').textContent = matchedRecipes.length;
    document.getElementById('perfect-matches').textContent = perfectMatches;
    
    const filterBy = document.getElementById('recipe-filter').value;
    const sorted = sortRecipes(matchedRecipes, filterBy);
    
    container.innerHTML = sorted.map(recipe => createRecipeCard(recipe)).join('');
}

function createRecipeCard(recipe) {
    const missingText = recipe.matchPercentage === 100 
        ? '✅ You can cook this now!'
        : `Missing: ${recipe.missingIngredients.slice(0, 2).join(', ')}${recipe.missingIngredients.length > 2 ? '...' : ''}`;
    
    const recipeImage = RECIPE_IMAGES[recipe.id] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
    
    return `
        <div class="recipe-card" onclick="showRecipeDetail(${recipe.id})">
            <img src="${recipeImage}" alt="${recipe.name}" class="recipe-image">
            <div class="recipe-content">
                <div class="recipe-header">
                    <h3 class="recipe-title">${recipe.name}</h3>
                    <div class="recipe-meta">
                        <span>⏱️ ${recipe.time}</span>
                        <span>🍽️ ${recipe.servings}</span>
                        <span>📊 ${recipe.difficulty}</span>
                    </div>
                </div>
                <div class="match-section">
                    <div class="match-text">${recipe.matchedCount}/${recipe.ingredients.length} ingredients (${recipe.matchPercentage}%)</div>
                    <div class="match-bar-container">
                        <div class="match-bar" style="width: ${recipe.matchPercentage}%"></div>
                    </div>
                    <div class="missing-text">${missingText}</div>
                </div>
            </div>
        </div>
    `;
}

// ===== Recipe Detail Modal =====
function showRecipeDetail(recipeId) {
    const recipe = RECIPES_DATABASE.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const matchedRecipes = matchRecipes();
    const matchedRecipe = matchedRecipes.find(r => r.id === recipeId);
    
    const modal = document.getElementById('recipe-modal');
    const title = document.getElementById('recipe-modal-title');
    const body = document.getElementById('recipe-modal-body');
    
    title.textContent = recipe.name;
    
    const ingredientsList = recipe.ingredients.map(ing => {
        const userHas = ingredients.some(userIng => 
            userIng.name.toLowerCase().includes(ing.toLowerCase()) ||
            ing.toLowerCase().includes(userIng.name.toLowerCase())
        );
        
        return `
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: ${userHas ? '#f0fdf4' : '#fff'}; border: 1px solid ${userHas ? '#10b981' : '#e5e7eb'}; border-radius: 12px; margin-bottom: 8px;">
                <span style="font-size: 20px;">${userHas ? '✓' : '○'}</span>
                <span style="flex: 1; font-weight: ${userHas ? '600' : '400'};">${ing}</span>
            </div>
        `;
    }).join('');
    
    const instructionsList = recipe.instructions.map((step, index) => `
        <div style="display: flex; gap: 16px; margin-bottom: 16px; padding: 16px; background: var(--bg-tertiary); border-radius: 12px;">
            <div style="width: 32px; height: 32px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">
                ${index + 1}
            </div>
            <div style="flex: 1; font-size: 15px; line-height: 1.6;">${step}</div>
        </div>
    `).join('');
    
    body.innerHTML = `
        <div style="padding: 24px;">
            ${matchedRecipe ? `
                <div style="padding: 16px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; margin-bottom: 24px; border: 1px solid #10b981;">
                    <div style="font-weight: 700; margin-bottom: 12px; color: #10b981;">
                        Match: ${matchedRecipe.matchPercentage}%
                    </div>
                    <div style="background: #e5e7eb; height: 10px; border-radius: 9999px; overflow: hidden;">
                        <div style="background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%); height: 100%; width: ${matchedRecipe.matchPercentage}%; border-radius: 9999px;"></div>
                    </div>
                </div>
            ` : ''}
            
            <h4 style="font-size: 18px; font-weight: 700; margin-bottom: 16px; font-family: 'Poppins', sans-serif;">Ingredients</h4>
            <div style="margin-bottom: 32px;">${ingredientsList}</div>
            
            <h4 style="font-size: 18px; font-weight: 700; margin-bottom: 16px; font-family: 'Poppins', sans-serif;">Instructions</h4>
            <div>${instructionsList}</div>
            
            <div style="display: flex; gap: 12px; margin-top: 32px;">
                <button class="btn btn-primary btn-full-modern" onclick="markAsCooked(${recipe.id})">
                    I Made This! (+${POINTS.COOK_RECIPE} pts)
                </button>
                <button class="btn btn-secondary" onclick="closeRecipeModal()">Close</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeRecipeModal() {
    document.getElementById('recipe-modal').classList.remove('active');
}

function markAsCooked(recipeId) {
    userStats.recipesCooked += 1;
    userStats.totalPoints += POINTS.COOK_RECIPE;
    saveData();
    showToast('Awesome!', `+${POINTS.COOK_RECIPE} points! Recipe completed`, 'success');
    closeRecipeModal();
    checkAchievements();
}

// ===== Home View =====
function updateHomeView() {
    const welcomeMessage = document.getElementById('welcome-message');
    const homeRecipesContainer = document.getElementById('home-recipes');
    
    if (ingredients.length === 0) {
        welcomeMessage.style.display = 'block';
        homeRecipesContainer.innerHTML = '';
        return;
    }
    
    welcomeMessage.style.display = 'none';
    
    const matchedRecipes = matchRecipes();
    const topRecipes = sortRecipes(matchedRecipes, 'match').slice(0, 3);
    
    homeRecipesContainer.innerHTML = topRecipes.map(recipe => createRecipeCard(recipe)).join('');
}

// ===== Insights View =====
function updateInsightsView() {
    document.getElementById('insight-money').textContent = `$${userStats.moneySaved}`;
    document.getElementById('insight-items').textContent = userStats.itemsSaved;
    document.getElementById('insight-recipes').textContent = userStats.recipesCooked;
    document.getElementById('insight-points').textContent = userStats.totalPoints;
    
    // Update achievements
    updateAchievementsDisplay();
}

// ===== Achievements =====
const ACHIEVEMENTS = [
    { id: 'first-step', condition: () => ingredients.length >= 1, icon: '🌟', name: 'First Step', desc: 'Added first ingredient' },
    { id: 'photo-pro', condition: () => ingredients.filter(i => i.photo).length >= 5, icon: '📸', name: 'Photo Pro', desc: 'Upload 5 photos' },
    { id: 'waste-warrior', condition: () => userStats.itemsSaved >= 10, icon: '🔥', name: 'Waste Warrior', desc: 'Save 10 items' },
    { id: 'master-chef', condition: () => userStats.recipesCooked >= 10, icon: '👨‍🍳', name: 'Master Chef', desc: 'Cook 10 recipes' },
    { id: 'money-saver', condition: () => userStats.moneySaved >= 50, icon: '💎', name: 'Money Saver', desc: 'Save $50' },
    { id: 'point-collector', condition: () => userStats.totalPoints >= 100, icon: '⭐', name: 'Point Collector', desc: 'Earn 100 points' }
];

function checkAchievements() {
    const unlockedAchievements = JSON.parse(localStorage.getItem('freshplate_ultra_achievements') || '[]');
    
    ACHIEVEMENTS.forEach(achievement => {
        if (achievement.condition() && !unlockedAchievements.includes(achievement.id)) {
            unlockedAchievements.push(achievement.id);
            localStorage.setItem('freshplate_ultra_achievements', JSON.stringify(unlockedAchievements));
            showToast('Achievement!', `🏆 ${achievement.name} unlocked!`, 'success');
        }
    });
}

function updateAchievementsDisplay() {
    const unlockedAchievements = JSON.parse(localStorage.getItem('freshplate_ultra_achievements') || '[]');
    const grid = document.getElementById('achievements-grid');
    
    grid.innerHTML = ACHIEVEMENTS.map(achievement => {
        const unlocked = unlockedAchievements.includes(achievement.id);
        return `
            <div class="achievement ${unlocked ? 'unlocked' : ''}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            </div>
        `;
    }).join('');
}

// ===== Stats Update =====
function updateStats() {
    const total = ingredients.length;
    const expiring = ingredients.filter(i => getDaysUntilExpiry(i.expirationDate) <= 3).length;
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-expiring').textContent = expiring;
    document.getElementById('fridge-badge').textContent = total;
    document.getElementById('total-points').textContent = userStats.totalPoints;
    document.getElementById('money-saved').textContent = `$${userStats.moneySaved}`;
    document.getElementById('items-saved').textContent = userStats.itemsSaved;
}

// ===== Toast Notifications =====
function showToast(title, message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toast-icon');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    
    toastIcon.textContent = type === 'success' ? '✓' : '!';
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// ===== Update All Views =====
function updateAllViews() {
    updateStats();
    updateHomeView();
    updateIngredientList();
    updateRecipeList();
    updateInsightsView();
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAddModal();
        closeRecipeModal();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openAddModal();
    }
});
