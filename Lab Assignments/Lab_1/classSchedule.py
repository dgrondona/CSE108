class Course:
    
    def __init__(self, dept, cn, name, credits, days, startTime, endTime, avgGrade):
        self.dept = dept
        self.cn = cn
        self.name = name
        self.credits = credits
        self.days = days
        self.startTime = startTime
        self.endTime = endTime
        self.avgGrade = avgGrade

    def outputFormatted(self, i):
        with open("output.txt", "a") as out:

                out.write(f"COURSE {i + 1}: {self.dept}{self.cn}: {self.name}\n")
                out.write(f"Number of Credits: {self.credits}\n")
                out.write(f"Days of Lectures: {self.days}\n")
                out.write(f"Lecture Time: {self.startTime} - {self.endTime}\n")
                out.write(f"Stat: on average, students get {self.avgGrade}% in this course\n\n")

courses = []

with open('classesInput.txt', 'r') as f:
    lines = f.readlines()
    n = int(lines[0])
    for i in range(n):
        start = 1 + i * 8
        dept = lines[start].strip()
        cn = lines[start + 1].strip()
        name = lines[start + 2].strip()
        credits = int(lines[start + 3].strip())
        days = lines[start + 4].strip()
        startTime = lines[start + 5].strip()
        endTime = lines[start + 6].strip()
        avgGrade = lines[start + 7].strip()
        c = Course(dept, cn, name, credits, days, startTime, endTime, avgGrade)
        courses.append(c)

open("output.txt", "w").close()

for i in range(len(courses)):
    courses[i].outputFormatted(i)