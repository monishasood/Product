// ===== Premium FreshPlate App ===== 

// App State
let ingredients = [];
let currentScreen = 'home';
let userStats = {
    moneySaved: 0,
    itemsSaved: 0,
    recipesCooked: 0
};

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    // Show splash screen
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
    }, 2000);
    
    loadData();
    setMinExpiryDate();
    updateAllViews();
    checkAchievements();
});

// ===== Local Storage =====
function loadData() {
    // Load ingredients
    const storedIngredients = localStorage.getItem('freshplate_ingredients');
    if (storedIngredients) {
        try {
            ingredients = JSON.parse(storedIngredients);
        } catch (e) {
            ingredients = [];
        }
    }
    
    // Load user stats
    const storedStats = localStorage.getItem('freshplate_stats');
    if (storedStats) {
        try {
            userStats = JSON.parse(storedStats);
        } catch (e) {
            userStats = { moneySaved: 0, itemsSaved: 0, recipesCooked: 0 };
        }
    }
}

function saveData() {
    localStorage.setItem('freshplate_ingredients', JSON.stringify(ingredients));
    localStorage.setItem('freshplate_stats', JSON.stringify(userStats));
    updateAllViews();
}

// ===== Screen Navigation =====
function switchScreen(screenName) {
    // Update active screen
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`${screenName}-screen`).classList.add('active');
    
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-screen="${screenName}"]`).classList.add('active');
    
    currentScreen = screenName;
    
    // Update view based on screen
    if (screenName === 'fridge') {
        updateIngredientList();
    } else if (screenName === 'recipes') {
        updateRecipeList();
    } else if (screenName === 'home') {
        updateHomeView();
    } else if (screenName === 'insights') {
        updateInsightsView();
    }
}

// ===== Date Utilities =====
function setMinExpiryDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expiry-input').min = today;
    
    // Set default to 7 days from now
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
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
        return { class: 'badge-danger', text: 'EXPIRED', priority: 4 };
    } else if (days <= 2) {
        return { class: 'badge-danger', text: 'USE NOW', priority: 3 };
    } else if (days <= 5) {
        return { class: 'badge-warning', text: 'SOON', priority: 2 };
    } else {
        return { class: 'badge-success', text: 'FRESH', priority: 1 };
    }
}

// ===== Ingredient Management =====
function openAddModal() {
    document.getElementById('add-modal').classList.add('active');
    // Focus on first input
    setTimeout(() => {
        document.getElementById('ingredient-select').focus();
    }, 300);
}

function closeAddModal() {
    document.getElementById('add-modal').classList.remove('active');
    document.getElementById('add-ingredient-form').reset();
    setMinExpiryDate(); // Reset default date
}

function handleAddIngredient(event) {
    event.preventDefault();
    
    const name = document.getElementById('ingredient-select').value;
    const quantity = document.getElementById('quantity-input').value;
    const expirationDate = document.getElementById('expiry-input').value;
    
    const newIngredient = {
        id: Date.now(),
        name: name,
        quantity: quantity,
        expirationDate: expirationDate,
        addedDate: new Date().toISOString(),
        used: false
    };
    
    ingredients.push(newIngredient);
    saveData();
    closeAddModal();
    
    // Show success toast
    showToast('✅ Ingredient added successfully!');
    
    // Switch to fridge screen
    setTimeout(() => {
        switchScreen('fridge');
    }, 500);
}

function deleteIngredient(id) {
    if (confirm('Remove this ingredient from your fridge?')) {
        const ingredient = ingredients.find(i => i.id === id);
        
        // Calculate value saved if using before expiry
        const daysLeft = getDaysUntilExpiry(ingredient.expirationDate);
        if (daysLeft >= 0) {
            const estimatedValue = 5; // Average $5 per ingredient
            userStats.moneySaved += estimatedValue;
            userStats.itemsSaved += 1;
            
            // Show impact banner
            showImpactBanner(estimatedValue);
        }
        
        ingredients = ingredients.filter(item => item.id !== id);
        saveData();
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
    
    container.style.display = 'flex';
    emptyState.style.display = 'none';
    progressSection.style.display = 'block';
    
    // Calculate freshness score
    updateFreshnessScore();
    
    // Get sort option
    const sortBy = document.getElementById('sort-filter').value;
    const sorted = sortIngredients(sortBy);
    
    container.innerHTML = sorted.map(item => {
        const status = getExpiryStatus(item.expirationDate);
        const days = getDaysUntilExpiry(item.expirationDate);
        const [emoji, ...nameParts] = item.name.split(' ');
        const displayName = nameParts.join(' ');
        
        let daysText = '';
        if (days < 0) {
            daysText = `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`;
        } else if (days === 0) {
            daysText = 'Expires today!';
        } else {
            daysText = `Expires in ${days} day${days !== 1 ? 's' : ''}`;
        }
        
        return `
            <div class="ingredient-item">
                <div class="ingredient-icon">${emoji}</div>
                <div class="ingredient-info">
                    <div class="ingredient-name">${displayName}</div>
                    <div class="ingredient-meta">
                        ${daysText} • ${item.quantity}
                    </div>
                </div>
                <div class="ingredient-actions">
                    <span class="badge ${status.class}">${status.text}</span>
                    <button class="btn btn-danger" onclick="deleteIngredient(${item.id})">
                        🗑️
                    </button>
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

function sortIngredients(sortBy) {
    const sorted = [...ingredients];
    
    if (sortBy === 'expiry') {
        sorted.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
    } else if (sortBy === 'name') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'added') {
        sorted.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
    }
    
    return sorted;
}

// ===== Recipe Matching =====
function matchRecipes() {
    if (ingredients.length === 0) {
        return [];
    }
    
    const userIngredients = ingredients.map(i => 
        i.name.replace(/[^\w\s]/gi, '').trim().toLowerCase()
    );
    
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
            missingIngredients: missingIngredients,
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
    
    container.style.display = 'flex';
    emptyState.style.display = 'none';
    statsSection.style.display = 'grid';
    
    // Update stats
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
        : `Missing: ${recipe.missingIngredients.slice(0, 3).join(', ')}${recipe.missingIngredients.length > 3 ? '...' : ''}`;
    
    // Determine gradient color based on category
    const gradients = {
        breakfast: 'linear-gradient(135deg, #ffa502 0%, #ff6348 100%)',
        lunch: 'linear-gradient(135deg, #48dbfb 0%, #0abde3 100%)',
        dinner: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
        salad: 'linear-gradient(135deg, #2ed573 0%, #26de81 100%)',
        soup: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    };
    
    const gradient = gradients[recipe.category] || gradients.dinner;
    
    return `
        <div class="recipe-card" onclick="showRecipeDetail(${recipe.id})">
            <div class="recipe-image" style="background: ${gradient}">
                ${recipe.emoji}
                ${recipe.usesExpiringItems ? '<div class="recipe-badge">⏰ Uses expiring items</div>' : ''}
            </div>
            <div class="recipe-details">
                <div class="recipe-title">${recipe.name}</div>
                <div class="recipe-meta">
                    <span>⏱️ ${recipe.time}</span>
                    <span>🍽️ ${recipe.servings} servings</span>
                    <span>📊 ${recipe.difficulty}</span>
                </div>
                <div class="match-info">
                    <div class="match-text">
                        You have ${recipe.matchedCount}/${recipe.ingredients.length} ingredients (${recipe.matchPercentage}%)
                    </div>
                    <div class="match-bar-container">
                        <div class="match-bar" style="width: ${recipe.matchPercentage}%"></div>
                    </div>
                    <div class="missing-ingredients">${missingText}</div>
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
    
    title.innerHTML = `<span class="modal-icon">${recipe.emoji}</span> ${recipe.name}`;
    
    const ingredientsList = recipe.ingredients.map(ing => {
        const userHas = ingredients.some(userIng => 
            userIng.name.toLowerCase().includes(ing.toLowerCase()) ||
            ing.toLowerCase().includes(userIng.name.toLowerCase().replace(/[^\w\s]/gi, ''))
        );
        
        return `
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: ${userHas ? 'rgba(99, 102, 241, 0.05)' : '#fff'}; border: 2px solid ${userHas ? 'var(--primary)' : 'var(--border-color)'}; border-radius: 12px; margin-bottom: 8px; transition: all 0.3s;">
                <span style="font-size: 24px;">${userHas ? '✅' : '⬜'}</span>
                <span style="flex: 1; font-weight: ${userHas ? '600' : '400'}; ${!userHas ? 'color: #999;' : ''}">${ing}</span>
            </div>
        `;
    }).join('');
    
    const instructionsList = recipe.instructions.map((step, index) => `
        <div style="display: flex; gap: 16px; margin-bottom: 20px; padding: 16px; background: var(--bg-primary); border-radius: 12px;">
            <div style="width: 36px; height: 36px; background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0;">
                ${index + 1}
            </div>
            <div style="flex: 1; padding-top: 6px; font-size: 15px; line-height: 1.6;">${step}</div>
        </div>
    `).join('');
    
    body.innerHTML = `
        <div style="margin-bottom: 30px;">
            <div style="display: flex; gap: 24px; padding: 20px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%); border-radius: 16px; margin-bottom: 20px;">
                <div><strong>⏱️</strong> ${recipe.time}</div>
                <div><strong>🍽️</strong> ${recipe.servings} servings</div>
                <div><strong>📊</strong> ${recipe.difficulty}</div>
            </div>
            ${matchedRecipe ? `
                <div style="padding: 20px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%); border-radius: 16px; margin-bottom: 20px; border: 2px solid var(--success);">
                    <div style="font-weight: 700; margin-bottom: 12px; font-size: 16px; color: var(--success);">
                        🎯 Match: ${matchedRecipe.matchPercentage}%
                    </div>
                    <div style="background: #e5e7eb; height: 12px; border-radius: 9999px; overflow: hidden;">
                        <div style="background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%); height: 100%; width: ${matchedRecipe.matchPercentage}%; border-radius: 9999px; transition: width 0.8s;"></div>
                    </div>
                </div>
            ` : ''}
        </div>
        
        <h4 style="font-size: 20px; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span>🥘</span> Ingredients
        </h4>
        <div style="margin-bottom: 32px;">
            ${ingredientsList}
        </div>
        
        <h4 style="font-size: 20px; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span>👨‍🍳</span> Instructions
        </h4>
        <div style="margin-bottom: 24px;">
            ${instructionsList}
        </div>
        
        <div style="display: flex; gap: 12px; margin-top: 32px;">
            <button class="btn btn-primary btn-full" onclick="markAsCooked(${recipe.id})">
                <span class="btn-icon">✅</span>
                I Made This!
            </button>
            <button class="btn btn-secondary" onclick="closeRecipeModal()" style="padding: 14px 28px;">
                Close
            </button>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeRecipeModal() {
    document.getElementById('recipe-modal').classList.remove('active');
}

function markAsCooked(recipeId) {
    userStats.recipesCooked += 1;
    saveData();
    showToast('🎉 Awesome! Recipe marked as cooked!');
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
    
    if (topRecipes.length === 0) {
        homeRecipesContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🍽️</div>
                <p>Add more ingredients to see recipe suggestions!</p>
            </div>
        `;
    } else {
        homeRecipesContainer.innerHTML = topRecipes.map(recipe => createRecipeCard(recipe)).join('');
    }
}

// ===== Insights View =====
function updateInsightsView() {
    document.getElementById('insight-money').textContent = `$${userStats.moneySaved}`;
    document.getElementById('insight-items').textContent = userStats.itemsSaved;
    document.getElementById('insight-recipes').textContent = userStats.recipesCooked;
}

// ===== Stats Update =====
function updateStats() {
    const total = ingredients.length;
    const expiring = ingredients.filter(i => getDaysUntilExpiry(i.expirationDate) <= 3).length;
    
    // Update all stat displays
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-expiring').textContent = expiring;
    document.getElementById('fridge-badge').textContent = total;
    
    if (total > 0) {
        document.getElementById('fridge-badge').classList.remove('hidden');
    } else {
        document.getElementById('fridge-badge').classList.add('hidden');
    }
    
    if (expiring > 0) {
        document.getElementById('home-badge').textContent = expiring;
        document.getElementById('home-badge').classList.remove('hidden');
    } else {
        document.getElementById('home-badge').classList.add('hidden');
    }
    
    // Update header stats
    document.getElementById('money-saved').textContent = `$${userStats.moneySaved}`;
    document.getElementById('items-saved').textContent = userStats.itemsSaved;
    
    // Update recipe badge
    const matchedRecipes = matchRecipes();
    if (matchedRecipes.length > 0) {
        document.getElementById('recipes-badge').textContent = matchedRecipes.length;
        document.getElementById('recipes-badge').classList.remove('hidden');
    } else {
        document.getElementById('recipes-badge').classList.add('hidden');
    }
}

// ===== Achievements System =====
function checkAchievements() {
    const achievements = [
        { id: 'first-step', condition: ingredients.length >= 1, icon: '🌟', name: 'First Step', desc: 'Added first ingredient' },
        { id: 'waste-warrior', condition: userStats.itemsSaved >= 10, icon: '🔥', name: 'Waste Warrior', desc: 'Save 10 items' },
        { id: 'master-chef', condition: userStats.recipesCooked >= 20, icon: '👨‍🍳', name: 'Master Chef', desc: 'Cook 20 recipes' },
        { id: 'money-saver', condition: userStats.moneySaved >= 100, icon: '💎', name: 'Money Saver', desc: 'Save $100' }
    ];
    
    const unlockedAchievements = JSON.parse(localStorage.getItem('freshplate_achievements') || '[]');
    
    achievements.forEach(achievement => {
        if (achievement.condition && !unlockedAchievements.includes(achievement.id)) {
            unlockedAchievements.push(achievement.id);
            localStorage.setItem('freshplate_achievements', JSON.stringify(unlockedAchievements));
            
            // Show achievement toast
            showToast(`🏆 Achievement Unlocked: ${achievement.name}!`);
        }
    });
}

// ===== UI Helpers =====
function showToast(message) {
    const toast = document.getElementById('success-toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function showImpactBanner(amount) {
    const banner = document.getElementById('impact-banner');
    const impactAmount = document.getElementById('impact-amount');
    
    impactAmount.textContent = `$${amount}`;
    banner.classList.remove('hidden');
    
    setTimeout(() => {
        banner.classList.add('hidden');
    }, 5000);
}

function closeImpactBanner() {
    document.getElementById('impact-banner').classList.add('hidden');
}

function showExpiringSoon() {
    document.getElementById('sort-filter').value = 'expiry';
    switchScreen('fridge');
}

function showHelp() {
    alert('🍽️ FreshPlate Help\n\n' +
          '• Add ingredients to track what you have\n' +
          '• Get smart recipe suggestions\n' +
          '• Use items before they expire\n' +
          '• Save money and reduce waste!\n\n' +
          'Tips:\n' +
          '- Check expiring items daily\n' +
          '- Cook recipes with high match %\n' +
          '- Add items right after shopping');
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
        closeImpactBanner();
    }
    
    // Quick add: Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openAddModal();
    }
});
