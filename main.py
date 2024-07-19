import string

def initializeFn():  # set all global variables and prepare for the program to run again once finished
    global alphabet, x, tomod, start, encode, rotationint, commands
    alphabet = list(string.ascii_lowercase)  # list of alphabet in lowercase
    x = []  # letters in input
    tomod = list(range(26))  # list that will undergo slicing and changes
    start = ""  # blank string for later modification
    encode = ""  # blank string for later modification
    rotationint = 0  # blank integer for later modification
    commands = ["e", "d", "q"]  # command bank

initializeFn()

print("Welcome to Caesar Cipher!")

def encoderFn(rotationint, encode):
    tomod = list(range(26))  # list that will undergo slicing and changes

    del tomod[-rotationint:]  # takes duplicated list of number and deletes numbers from the right by the # of rotationint
    endslice = list(range(26))[-rotationint:]
    new = endslice + tomod  # new rotation list

    x = [alphabet.index(i) if i in alphabet else i for i in encode]  # index of input letters in alphabet list

    for i in range(len(x)):  # for the number of values in list x
        if isinstance(x[i], int):  # if the index value i of x is an integer...
            x[i] = alphabet[new[x[i]]]
    encodedstr = "".join(x)  # takes the list x and turns it into a str
    print("The encoded string is as follows: " + encodedstr)
    print("" + "60 9 to check, testing")
    return encodedstr  # returns the encoded string

def decoderFn(decode, plaintext):
    alphabet = list(string.ascii_lowercase)  # list of alphabet in lowercase
    enclist = []  # list to hold encoded versions of plaintext
    foundrot = 0  # variable to store found rotation

    for i in range(1, 26):
        tomod = list(range(26))  # list that will undergo slicing and changes
        del tomod[-i:]  # take duplicated list of number and delete numbers from the right by the # of rotation
        endslice = list(range(26))[-i:]
        new = endslice + tomod  # new rotation list

        x = [alphabet.index(letter) if letter in alphabet else letter for letter in plaintext]  # index of input letters in alphabet list

        for j in range(len(x)):  # for the number of values in list x
            if isinstance(x[j], int):  # if the index value j of x is an integer...
                x[j] = alphabet[new[x[j]]]
        encodedstr = "".join(x)  # takes the list x and turns it into a str
        enclist.append(encodedstr)  # add encoded string to list

    declist = decode.split()  # split the decode string into words

    for word in declist:  # for each word in the decoded list
        if word in enclist:  # if the word is found in the encoded list
            print("")
            print("The rotation is " + str(enclist.index(word) + 1))  # add one because of index behavior
            foundrot = enclist.index(word) + 1  # store the found rotation

    enctodec = ""  # blank string for the decoded result

    for word in declist:  # for each word in the decoded list
        for letter in word:  # for each letter in the word
            decindex = 0  # initialize the decoded index
            if letter in alphabet:
                decindex = alphabet.index(letter) + foundrot  # brings the encoded letters to their decoded index value
            if decindex > 25:
                decindex -= 26  # adjust index if it goes beyond the alphabet range
            if letter in alphabet:
                enctodec += alphabet[decindex]  # add decoded letter to the result
            else:
                enctodec += letter  # add non-alphabet character as is
        enctodec += " "  # add space between words

    enctodec = enctodec.rstrip()  # remove trailing whitespace

    if foundrot != 0:
        print("The decoded string is: '" + enctodec + "'")
        print("")
    else:
        print("The rotation was not found, thus, the string could not be decoded.")
        print("")

while start not in commands:  # keeps prompting user until they enter a command in the bank
    start = input("e - encode a string\nd - decode a string\nq - quit\n\n")
    if start == "e":
        while encode == "":  # keeps prompting user until they type a lowercase letter from alphabet list
            encode = input("What string would you like to encode now?\n")
        # keeps prompting user until their int is in range
        while rotationint < 1 or rotationint > 25:
            rotationint = int(input("Pick a rotation integer in the range of 1-25 please:\n"))
        encoderFn(rotationint, encode)  # make sure this is up to date and running latest version ok

    elif start == "d":
        decode = input("What string would you like to decode now?\n")
        plaintext = input("Enter a decoded word from the string:\n")
        decoderFn(decode, plaintext)  # call the decoder function

    elif start == "q":
        print("Quitting program, have a good day!")
        quit()
    else:
        print("\nUnrecognized command.\n")
    initializeFn()  # reset the variables for a new command
