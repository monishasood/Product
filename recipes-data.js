// Recipe Database
const RECIPES_DATABASE = [
    {
        id: 1,
        name: "Spinach & Feta Omelet",
        emoji: "🍳",
        time: "15 min",
        servings: 2,
        difficulty: "Easy",
        ingredients: ["Spinach", "Eggs", "Feta Cheese", "Butter"],
        instructions: [
            "Beat 3 eggs in a bowl with salt and pepper",
            "Heat butter in a non-stick pan over medium heat",
            "Sauté 1 cup of spinach until wilted (about 2 minutes)",
            "Pour eggs over spinach and cook until edges set",
            "Add crumbled feta cheese to one half",
            "Fold omelet in half and cook for 1 more minute",
            "Slide onto plate and serve hot"
        ],
        category: "breakfast"
    },
    {
        id: 2,
        name: "Chicken Stir Fry",
        emoji: "🍜",
        time: "25 min",
        servings: 3,
        difficulty: "Medium",
        ingredients: ["Chicken Breast", "Bell Peppers", "Onions", "Rice", "Carrots"],
        instructions: [
            "Cook rice according to package directions",
            "Cut chicken into bite-sized pieces",
            "Slice bell peppers, onions, and carrots",
            "Heat oil in a wok or large pan",
            "Stir-fry chicken until cooked through (5-6 minutes)",
            "Add vegetables and stir-fry for 4-5 minutes",
            "Add soy sauce and season to taste",
            "Serve over cooked rice"
        ],
        category: "dinner"
    },
    {
        id: 3,
        name: "Cheesy Scrambled Eggs",
        emoji: "🥘",
        time: "10 min",
        servings: 2,
        difficulty: "Easy",
        ingredients: ["Eggs", "Cheddar Cheese", "Butter", "Milk"],
        instructions: [
            "Beat 4 eggs with 2 tablespoons milk",
            "Melt butter in a pan over medium-low heat",
            "Pour in egg mixture",
            "Gently stir eggs as they cook",
            "When nearly set, add shredded cheddar cheese",
            "Continue stirring until cheese melts",
            "Serve immediately"
        ],
        category: "breakfast"
    },
    {
        id: 4,
        name: "Veggie Pasta",
        emoji: "🍝",
        time: "20 min",
        servings: 4,
        difficulty: "Easy",
        ingredients: ["Pasta", "Tomatoes", "Spinach", "Mushrooms", "Parmesan"],
        instructions: [
            "Boil pasta according to package directions",
            "While pasta cooks, sauté mushrooms in olive oil",
            "Add chopped tomatoes and cook for 5 minutes",
            "Add spinach and cook until wilted",
            "Drain pasta and toss with vegetables",
            "Top with grated parmesan cheese",
            "Serve hot"
        ],
        category: "dinner"
    },
    {
        id: 5,
        name: "Chicken Rice Bowl",
        emoji: "🍲",
        time: "30 min",
        servings: 3,
        difficulty: "Medium",
        ingredients: ["Chicken Breast", "Rice", "Broccoli", "Carrots"],
        instructions: [
            "Cook rice according to package directions",
            "Season chicken breast with salt and pepper",
            "Grill or pan-fry chicken until cooked through",
            "Steam broccoli and carrots",
            "Slice cooked chicken",
            "Assemble bowls with rice, vegetables, and chicken",
            "Drizzle with your favorite sauce"
        ],
        category: "lunch"
    },
    {
        id: 6,
        name: "Caprese Salad",
        emoji: "🥗",
        time: "10 min",
        servings: 2,
        difficulty: "Easy",
        ingredients: ["Tomatoes", "Feta Cheese", "Lettuce"],
        instructions: [
            "Slice tomatoes into rounds",
            "Tear lettuce into bite-sized pieces",
            "Crumble feta cheese",
            "Layer tomatoes and cheese on lettuce",
            "Drizzle with olive oil and balsamic vinegar",
            "Season with salt, pepper, and fresh basil",
            "Serve immediately"
        ],
        category: "salad"
    },
    {
        id: 7,
        name: "Veggie Omelet",
        emoji: "🥚",
        time: "15 min",
        servings: 2,
        difficulty: "Easy",
        ingredients: ["Eggs", "Bell Peppers", "Onions", "Mushrooms", "Cheddar Cheese"],
        instructions: [
            "Beat eggs in a bowl",
            "Dice bell peppers, onions, and mushrooms",
            "Sauté vegetables until soft",
            "Pour eggs over vegetables",
            "Add shredded cheese",
            "Fold omelet when eggs are set",
            "Serve hot"
        ],
        category: "breakfast"
    },
    {
        id: 8,
        name: "Chicken Caesar Salad",
        emoji: "🥙",
        time: "20 min",
        servings: 2,
        difficulty: "Easy",
        ingredients: ["Chicken Breast", "Lettuce", "Parmesan", "Bread"],
        instructions: [
            "Grill or pan-fry chicken breast",
            "Tear lettuce into pieces",
            "Cube bread and toast for croutons",
            "Slice cooked chicken",
            "Toss lettuce with dressing",
            "Top with chicken, croutons, and parmesan",
            "Serve immediately"
        ],
        category: "salad"
    },
    {
        id: 9,
        name: "Tomato Soup",
        emoji: "🍅",
        time: "30 min",
        servings: 4,
        difficulty: "Easy",
        ingredients: ["Tomatoes", "Onions", "Milk", "Butter"],
        instructions: [
            "Chop tomatoes and onions",
            "Sauté onions in butter until soft",
            "Add tomatoes and cook for 10 minutes",
            "Blend until smooth",
            "Return to pot and add milk",
            "Season with salt, pepper, and herbs",
            "Simmer for 5 minutes and serve"
        ],
        category: "soup"
    },
    {
        id: 10,
        name: "Mushroom Risotto",
        emoji: "🍄",
        time: "35 min",
        servings: 3,
        difficulty: "Medium",
        ingredients: ["Rice", "Mushrooms", "Onions", "Parmesan", "Butter"],
        instructions: [
            "Sauté diced onions in butter",
            "Add sliced mushrooms and cook until soft",
            "Add rice and stir for 2 minutes",
            "Gradually add hot broth, stirring constantly",
            "Continue until rice is creamy and tender",
            "Stir in grated parmesan",
            "Serve immediately"
        ],
        category: "dinner"
    },
    {
        id: 11,
        name: "Greek Salad",
        emoji: "🫒",
        time: "10 min",
        servings: 2,
        difficulty: "Easy",
        ingredients: ["Tomatoes", "Cucumber", "Feta Cheese", "Onions"],
        instructions: [
            "Chop tomatoes and cucumber into chunks",
            "Slice onions thinly",
            "Crumble feta cheese",
            "Combine all ingredients in a bowl",
            "Drizzle with olive oil and lemon juice",
            "Season with oregano, salt, and pepper",
            "Toss and serve"
        ],
        category: "salad"
    },
    {
        id: 12,
        name: "Chicken Quesadilla",
        emoji: "🌮",
        time: "15 min",
        servings: 2,
        difficulty: "Easy",
        ingredients: ["Chicken Breast", "Cheddar Cheese", "Bell Peppers", "Onions"],
        instructions: [
            "Cook and shred chicken breast",
            "Dice bell peppers and onions",
            "Sauté vegetables until soft",
            "Place tortilla in pan",
            "Add chicken, cheese, and vegetables to half",
            "Fold and cook until cheese melts",
            "Cut into wedges and serve"
        ],
        category: "lunch"
    },
    {
        id: 13,
        name: "Egg Fried Rice",
        emoji: "🍚",
        time: "15 min",
        servings: 3,
        difficulty: "Easy",
        ingredients: ["Rice", "Eggs", "Carrots", "Onions"],
        instructions: [
            "Use day-old cooked rice (or cook and cool fresh rice)",
            "Scramble eggs and set aside",
            "Dice carrots and onions",
            "Stir-fry vegetables in oil",
            "Add rice and stir-fry for 5 minutes",
            "Mix in scrambled eggs",
            "Season with soy sauce and serve"
        ],
        category: "dinner"
    },
    {
        id: 14,
        name: "Broccoli Cheese Soup",
        emoji: "🥦",
        time: "25 min",
        servings: 4,
        difficulty: "Easy",
        ingredients: ["Broccoli", "Cheddar Cheese", "Milk", "Butter", "Onions"],
        instructions: [
            "Chop broccoli into florets",
            "Sauté diced onions in butter",
            "Add broccoli and cook for 5 minutes",
            "Pour in milk and simmer until tender",
            "Blend until smooth (or leave chunky)",
            "Stir in shredded cheddar cheese",
            "Season and serve hot"
        ],
        category: "soup"
    },
    {
        id: 15,
        name: "Avocado Toast",
        emoji: "🥑",
        time: "5 min",
        servings: 1,
        difficulty: "Easy",
        ingredients: ["Bread", "Avocado", "Eggs", "Tomatoes"],
        instructions: [
            "Toast bread until golden",
            "Mash avocado with salt and pepper",
            "Spread avocado on toast",
            "Top with sliced tomatoes",
            "Optional: add a fried or poached egg",
            "Drizzle with olive oil",
            "Serve immediately"
        ],
        category: "breakfast"
    }
];
