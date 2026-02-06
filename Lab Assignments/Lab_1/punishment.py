sentence = input("Sentence: ")
numTimes = input("Number of times repeated: ")

with open('CompletedPunishment.txt', 'a') as f:
    for i in range(int(numTimes)):
        f.write(sentence + "\n")