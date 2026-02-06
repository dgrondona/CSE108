while True:

    numbers = []
    sum = 0
    i = 0

    numbers = input("Input numbers: ").split()
    numLen = len(numbers)

    if numLen < 2:
        print("You must enter at least 2 numbers.")
        continue

    break

for numLen in numbers:
    sum += int(numbers[i])
    i += 1

print(sum)