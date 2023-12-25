import pymongo

# Connect to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")  # Use the correct IP address or hostname
db = client["web"]
students_collection = db["students"]
positions_collection = db['positions']
promises_collection = db['promises']
business_collection = db['businesses']

# Retrieve data from MongoDB collections
# Replace the following lines with the correct data retrieval code
# Example:
id_gpa = [(doc["_id"], doc["cpa"], doc.get("cert", 0)) for doc in students_collection.find({}, {"_id": 1, "cpa": 1, "cert": 1})]
positions = [(doc["_id"], doc["capacity"], doc["cpa_required"]) for doc in positions_collection.find({}, {"_id": 1, "capacity": 1, "cpa_required": 1})]
promises = [(doc["_id"], [promise["_id"] for promise in doc.get("promised_positions", [])]) for doc in promises_collection.find({}, {"_id": 1, "promised_positions._id": 1})]
students = [(item1[0], item1[1] + item1[2], item2[1]) for item1 in id_gpa for item2 in promises if item1[0] == item2[0]]

students = [(item1[0], item1[1] + item1[2], item2[1]) for item1 in id_gpa for item2 in promises if item1[0] == item2[0]]

id = [x[0] for x in students]
mvt = [x[0] for x in positions]

promision = {}
for i in range(3):
    pm = {position[0] : [] for position in positions}
    for position in positions:
        for student in students:
            if((student[2])[i] == position[0]):
                pm[position[0]].append((student[0],student[1]))
    lst_pm = [[k,v, *position[1:]] for k,v in pm.items() for position in positions if position[0] == k]
    dct_pm = {x[0] : x[1:] for x in lst_pm}
    promision[f'NV{i+1}'] = dct_pm
# print(f"{promision}")

#loại bỏ đi các sinh viên có điểm thấp hơn điểm sàn
# def cut(lst, k):
#     cut_list = []
#     for x in lst:
#         if(x[1] >= k):
#             cut_list.append((x[0],x[1]))
#     return cut_list
#sau khi match được sinh viên thì xóa sinh viên đó khỏi list id
def delete(id,lst):
    new_id = []
    for i in range(len(id)):
        if lst is not None and id[i] not in lst:
            new_id.append(id[i])
    return new_id
def matching(promision, ids, mvt_list):
    result = {}
    for nv in promision.keys():
        dct = promision[nv]
        for mvt in mvt_list:
            list_student = dct[mvt]
            list_student[0].sort(key=lambda x: x[1], reverse=True)
            # list_student[0] = cut(list_student[0], list_student[2])
            if len(list_student[0]) > list_student[1]:
                list_student[0] = (list_student[0])[:list_student[1]]
            msvs = [x[0] for x in list_student[0]]
            for msv in msvs:
                if msv in ids:
                    if mvt not in result:
                        result[mvt] = []
                    result[mvt].append(msv)
                    ids = delete(ids, msv)
    return result

# def getInfor(studentId):
    

match_std = matching(promision,id,mvt)

with open("output_match.txt", "w", encoding="utf-8") as output_file:
    # output_file.write("Vị trí theo nguyện vọng (tức là xét nguyện vọng 1,2,3 xem từng vị trí có những sv nào apply):\n")
    for key, value in promision.items():
        output_file.write(f"{key}: {value}\n")
    output_file.write("Kết quả matching:\n")
    for key, value in match_std.items():
        output_file.write(f"{key}: {value}\n")
    

# print("Kết quả matching:")
for x in match_std:
    print(x,match_std[x])

results = db['internship_results']
for i in match_std.keys():
    position_id = i
    position_data = positions_collection.find_one({"_id": position_id},{"name": 1,"business": 1})
    position_name = position_data["name"]
    position_business = position_data["business"]
    business_data = business_collection.find_one({"_id": position_business},{"name":1})
    business_name = business_data["name"]
    
    list_student = match_std[i]
    for j in list_student:
        student_data = students_collection.find_one({"_id": j}, {"name": 1,"birthday":1, "sex": 1, "major": 1})
        result = {
            "_id": student_data["_id"],
            "name": student_data["name"],
            "birthday": student_data['birthday'],
            "sex": student_data['sex'],
            "major": student_data['major'],
            "position": position_name,
            "business": business_name
        }
        results.insert_one(result)
