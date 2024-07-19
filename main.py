import string

def initializeFn(): #set all global variables and prepare for program to run again once finished
    global alphabet, x, numbers, tomod, start, encode, rotationint, commands
    alphabet = list(string.ascii_lowercase)  # list of alphabet in lowercase
    x = []  # letters in input
    numbers = list(range(26))  # set list of numbers from 0 to 25
    tomod = list(range(26))  # list that will undergo slicing and changes
    start = ""  # blank string for later modification
    encode = ""  # blank string for later modification
    rotationint = 0  # blank integer for later modification
    commands = ["e", "d", "q"]  # commmand bank


initializeFn()

print("Welcome to Caesar Cipher!")

def encoderFn(rotationint, encode):
    alphabet = list(string.ascii_lowercase)  # list of alphabet in lowercase
    x = []  # letters in input
    del tomod[-rotationint:] #takes duplicated list of number and deletes numbers from the right by the # ofrotationint
    endslice = numbers[-rotationint:]
    new = endslice + tomod
    for i in encode:
        if i in alphabet:
            x.append(alphabet.index(i))  # index of input letters in alphabet list
        else:
            x.append(i)  # if it is a non alphabet character

    for i in range(len(x)): #for the number of values in list x
        if isinstance(x[i], int):  # if the index value i of x is an integer...
            x[i] = alphabet[new[x[i]]]
    encodedstr = "".join(x)  # takes the list x and turns it into a str
    print("The encoded string is: " + encodedstr)
    print("")
    return encodedstr #returns the encoded string

while start not in commands:  # keeps prompting user until they enter a command in the bank
    start = input("e - encode a string\nd - decode a string\nq - quit\n\n")
    if start == "e":
        while encode == "":  # keeps prompting user until they type a lowercase letter from alphabet list
            encode = input("What string would you like to encode?\n")
        # keeps prompting user until their int is in range
        while rotationint < 1 or rotationint > 25:
            rotationint = int(input("Pick a rotation integer in the range of 1-25:\n"))
        encoderFn(rotationint, encode)

    elif start == "d":
        new = []
        alphabet = list(string.ascii_lowercase)
        numbers = list(range(26))  # set list of numbers from 0 to 25
        tomod = list(range(26))  # list that will undergo slicing and changes
        rotation = 0

        decode = input("What string would you like to decode?\n")
        decode = decode.lower()
        plaintext = input("Enter a decoded word from the string:\n")
        plaintext = plaintext.lower()
        encode = plaintext
        enclist = []
        foundrot = 0

        for i in range(1, 26):
            x = []
            tomod = list(range(26))
            del tomod[-i:]
            endslice = numbers[-i:]
            new = endslice + tomod

            for i in encode:
                if i in alphabet:
                    x.append(alphabet.index(i))  # index of input letters in alphabet list
                else:
                    x.append(i)  # if it is a non alphabet character

            for i in range(len(x)):
                if isinstance(x[i], int):  # if the index value i of x is an integer...
                    x[i] = alphabet[new[x[i]]]
            encodedstr = "".join(x)  # takes the list x and turns it into a str
            enclist.append(encodedstr)
        declist = decode.split()