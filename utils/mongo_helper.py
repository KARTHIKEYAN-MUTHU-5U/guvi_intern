# FILE: utils/mongo_helper.py

from pymongo import MongoClient
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client['guvi_profiles']
collection = db['profiles']

def get_profile(email):
    profile = collection.find_one({"email": email}, {"_id": 0})
    return profile

def update_profile(email, data):
    collection.update_one({"email": email}, {"$set": data}, upsert=True)

def set_profile_pic(email, filename):
    collection.update_one({"email": email}, {"$set": {"profile_pic": filename}}, upsert=True)

def get_profile_pic_path(email):
    profile = collection.find_one({"email": email}, {"profile_pic": 1})
    return profile.get("profile_pic") if profile else None
