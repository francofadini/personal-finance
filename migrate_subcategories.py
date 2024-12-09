from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

# Connect to MongoDB
client = MongoClient('mongodb+srv://backend:pf2024!@personal-finance.zr2ym.mongodb.net')
db = client['test']

def migrate_subcategories():
    # First, create default subcategories for all main categories
    main_categories = list(db.categories.find({'parentId': None}))
    print(f"Found {len(main_categories)} main categories")
    
    for cat in main_categories:
        default_subcategory = {
            'userId': cat['userId'],
            'categoryId': cat['_id'],
            'name': cat['name'],
            'keywords': cat.get('keywords', []),
            'monthlyBudget': 0,
            'isDefault': True,
            'isVisible': False,
            'createdAt': cat.get('createdAt', datetime.utcnow()),
            'updatedAt': datetime.utcnow()
        }
        
        try:
            result = db.subcategories.insert_one(default_subcategory)
            print(f"Created default subcategory for {cat['name']} -> {result.inserted_id}")
        except Exception as e:
            print(f"Error creating default subcategory for {cat['name']}: {str(e)}")

    # Then migrate existing subcategories
    subcategories = list(db.categories.find({'parentId': {'$ne': None}}))
    print(f"\nFound {len(subcategories)} subcategories to migrate")
    
    for sub in subcategories:
        new_subcategory = {
            'userId': sub['userId'],
            'categoryId': sub['parentId'],
            'name': sub['name'],
            'keywords': sub.get('keywords', []),
            'monthlyBudget': 0,
            'isDefault': False,  # Explicitly set to false for migrated subcategories
            'isVisible': True,
            'createdAt': sub.get('createdAt', datetime.utcnow()),
            'updatedAt': datetime.utcnow()
        }
        
        try:
            # Verify parent category exists
            parent = db.categories.find_one({'_id': sub['parentId']})
            if not parent:
                print(f"Warning: Parent category not found for {sub['name']}")
                continue

            # Insert into new subcategories collection
            result = db.subcategories.insert_one(new_subcategory)
            print(f"Migrated subcategory {sub['name']} -> {result.inserted_id}")
            
            # Delete from categories collection
            db.categories.delete_one({'_id': sub['_id']})
            print(f"Deleted old subcategory {sub['name']}")
        except Exception as e:
            print(f"Error migrating {sub['name']}: {str(e)}")

    # Print summary
    remaining_categories = db.categories.count_documents({})
    migrated_subcategories = db.subcategories.count_documents({})
    default_subcategories = db.subcategories.count_documents({'isDefault': True})
    
    print(f"\nMigration complete!")
    print(f"Remaining categories: {remaining_categories}")
    print(f"Default subcategories created: {default_subcategories}")
    print(f"Regular subcategories migrated: {migrated_subcategories - default_subcategories}")
    print(f"Total subcategories: {migrated_subcategories}")

if __name__ == "__main__":
    # Confirm before proceeding
    print("This will migrate subcategories to a new collection.")
    print("Make sure you have a backup of your database!")
    response = input("Do you want to proceed? (yes/no): ")
    
    if response.lower() == 'yes':
        migrate_subcategories()
    else:
        print("Migration cancelled") 