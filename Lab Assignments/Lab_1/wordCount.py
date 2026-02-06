word = input("Enter a word: ").lower()

with open('PythonSummary.txt', 'r') as f:
    contents = f.read().lower()
    count = contents.count(word)

print("The word " + word + " occurs " + str(count) + " times")