import json

def loadGrades():

    with open('grades.txt', 'r') as f:
        return json.load(f)
    
def saveGrades(grades):

    with open('grades.txt', 'w') as f:
        return json.dump(grades, f, indent = 2)
    
def addStudent(grades):

    name = input("Enter student full name: ")
    grade = input("Enter grade: ")

    grades[name] = grade

    saveGrades(grades)
    print("Student added.\n")

def get_grade(grades):

    name = input("Enter student full name: ")

    if name in grades:

        print(f"{name}'s grade: {grades[name]}\n")

    else:

        print("Student not found.\n")

def edit_grade(grades):

    name = input("Enter student full name: ")

    if name in grades:

        new_grade = input("Enter new grade: ")
        grades[name] = new_grade

        saveGrades(grades)
        print("Grade updated.\n")

    else:

        print("Student not found.\n")

def delete_grade(grades):

    name = input("Enter student full name: ")

    if name in grades:

        del grades[name]

        saveGrades(grades)
        print("Student deleted.\n")

    else:

        print("Student not found.\n")

def menu():

    print("1. Add student")
    print("2. Get grade")
    print("3. Edit grade")
    print("4. Delete grade")
    print("5. Exit")

def main():

    grades = loadGrades()

    while True:

        menu()
        choice = input("Choose option: ")

        if choice == "1":

            addStudent(grades)

        elif choice == "2":

            get_grade(grades)

        elif choice == "3":

            edit_grade(grades)

        elif choice == "4":

            delete_grade(grades)

        elif choice == "5":

            print("Goodbye!")
            break

        else:

            print("Invalid choice.\n")

main()