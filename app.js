// ===== App State =====
let ingredients = [];
let currentScreen = 'home';

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    loadIngredients();
    setMinExpiryDate();
    updateAllViews();
});

// ===== Local Storage Functions =====
function loadIngredients() {
    const stored = localStorage.getItem('freshplate_ingredients');
    if (stored) {
        try {
            ingredients = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading ingredients:', e);
            ingredients = [];
        }
    }
}

function saveIngredients() {
    localStorage.setItem('freshplate_ingredients', JSON.stringify(ingredients));
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
    }
}

// ===== Date Utilities =====
function setMinExpiryDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expiry-input').min = today;
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

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ===== Ingredient Management =====
function openAddModal() {
    document.getElementById('add-modal').classList.add('active');
}

function closeAddModal() {
    document.getElementById('add-modal').classList.remove('active');
    document.getElementById('add-ingredient-form').reset();
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
        addedDate: new Date().toISOString()
    };
    
    ingredients.push(newIngredient);
    saveIngredients();
    closeAddModal();
    
    // Switch to fridge screen to show the added ingredient
    switchScreen('fridge');
}

function deleteIngredient(id) {
    if (confirm('Remove this ingredient from your fridge?')) {
        ingredients = ingredients.filter(item => item.id !== id);
        saveIngredients();
    }
}

// ===== Ingredient List View =====
function updateIngredientList() {
    const container = document.getElementById('ingredient-list');
    const emptyState = document.getElementById('fridge-empty');
    
    if (ingredients.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'flex';
    emptyState.style.display = 'none';
    
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
        
        // Check if recipe uses expiring items
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
        // Show only recipes using expiring items
        return sorted.filter(r => r.usesExpiringItems)
            .sort((a, b) => b.matchPercentage - a.matchPercentage);
    } else if (filterBy === 'quick') {
        // Show quick recipes (<= 20 min)
        return sorted.filter(r => parseInt(r.time) <= 20)
            .sort((a, b) => b.matchPercentage - a.matchPercentage);
    } else {
        // Default: Sort by match percentage, prioritize expiring items
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
    
    const matchedRecipes = matchRecipes();
    
    if (matchedRecipes.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'flex';
    emptyState.style.display = 'none';
    
    const filterBy = document.getElementById('recipe-filter').value;
    const sorted = sortRecipes(matchedRecipes, filterBy);
    
    container.innerHTML = sorted.map(recipe => createRecipeCard(recipe)).join('');
}

function createRecipeCard(recipe) {
    const missingText = recipe.matchPercentage === 100 
        ? '✅ You can cook this now!'
        : `Missing: ${recipe.missingIngredients.slice(0, 3).join(', ')}${recipe.missingIngredients.length > 3 ? '...' : ''}`;
    
    return `
        <div class="recipe-card" onclick="showRecipeDetail(${recipe.id})">
            <div class="recipe-image">
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
    
    title.textContent = recipe.name;
    
    // Build ingredient list with checkmarks
    const ingredientsList = recipe.ingredients.map(ing => {
        const userHas = ingredients.some(userIng => 
            userIng.name.toLowerCase().includes(ing.toLowerCase()) ||
            ing.toLowerCase().includes(userIng.name.toLowerCase().replace(/[^\w\s]/gi, ''))
        );
        
        return `
            <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: ${userHas ? '#f0f9ff' : '#fff'}; border-radius: 8px; margin-bottom: 8px;">
                <span style="font-size: 20px;">${userHas ? '✅' : '⬜'}</span>
                <span style="flex: 1; ${!userHas ? 'color: #999;' : ''}">${ing}</span>
            </div>
        `;
    }).join('');
    
    // Build instructions
    const instructionsList = recipe.instructions.map((step, index) => `
        <div style="display: flex; gap: 15px; margin-bottom: 16px;">
            <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">
                ${index + 1}
            </div>
            <div style="flex: 1; padding-top: 4px;">${step}</div>
        </div>
    `).join('');
    
    body.innerHTML = `
        <div style="margin-bottom: 24px;">
            <div style="display: flex; gap: 20px; padding: 16px; background: #f8f9fa; border-radius: 12px; margin-bottom: 16px;">
                <div>⏱️ ${recipe.time}</div>
                <div>🍽️ ${recipe.servings} servings</div>
                <div>📊 ${recipe.difficulty}</div>
            </div>
            ${matchedRecipe ? `
                <div style="padding: 16px; background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-radius: 12px; margin-bottom: 16px;">
                    <div style="font-weight: 600; margin-bottom: 8px;">
                        Match: ${matchedRecipe.matchPercentage}%
                    </div>
                    <div style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100%; width: ${matchedRecipe.matchPercentage}%; border-radius: 4px;"></div>
                    </div>
                </div>
            ` : ''}
        </div>
        
        <h4 style="font-size: 18px; font-weight: 700; margin-bottom: 16px;">Ingredients</h4>
        <div style="margin-bottom: 32px;">
            ${ingredientsList}
        </div>
        
        <h4 style="font-size: 18px; font-weight: 700; margin-bottom: 16px;">Instructions</h4>
        <div>
            ${instructionsList}
        </div>
    `;
    
    modal.classList.add('active');
}

function closeRecipeModal() {
    document.getElementById('recipe-modal').classList.remove('active');
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

// ===== Stats Update =====
function updateStats() {
    const total = ingredients.length;
    const expiring = ingredients.filter(i => getDaysUntilExpiry(i.expirationDate) <= 3).length;
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-expiring').textContent = expiring;
    document.getElementById('totalItems').textContent = total;
    document.getElementById('expiringItems').textContent = expiring;
}

// ===== Update All Views =====
function updateAllViews() {
    updateStats();
    updateHomeView();
    updateIngredientList();
    updateRecipeList();
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        closeAddModal();
        closeRecipeModal();
    }
});

// Close modals when clicking overlay
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeAddModal();
        closeRecipeModal();
    }
});
