import string

def initializeFn():  # set all global variables and prepare for the program to run again once finished
    global alphabet, start, encode, rotationint, commands
    alphabet = list(string.ascii_lowercase)  # list of alphabet in lowercase
    start = ""  # blank string for later modification
    encode = ""  # blank string for later modification
    rotationint = 0  # blank integer for later modification
    commands = ["e", "d", "q"]  # command bank

initializeFn()

print("Welcome to Caesar Cipher!")

def encoderFn(rotationint, encode):
    tomod = list(range(26))  # list that will undergo slicing and changes
    new = list(range(26))[-rotationint:] + tomod[:-rotationint]  # new rotation list

    x = [alphabet.index(i) if i in alphabet else i for i in encode]  # index of input letters in alphabet list

    for i in range(len(x)):  # for the number of values in list x
        if isinstance(x[i], int):  # if the index value i of x is an integer...
            x[i] = alphabet[new[x[i]]]
    encodedstr = "".join(x)  # takes the list x and turns it into a str
    print("The encoded string is as follows: " + encodedstr)
    return encodedstr  # returns the encoded string

def decoderFn(decode, plaintext):
    enclist = []  # list to hold encoded versions of plaintext
    foundrot = 0  # variable to store found rotation

    for i in range(1, 26):
        new = list(range(26))[-i:] + list(range(26))[:-i]  # new rotation list
        x = [alphabet.index(letter) if letter in alphabet else letter for letter in plaintext]  # index of input letters in alphabet list

        for j in range(len(x)):  # for the number of values in list x
            if isinstance(x[j], int):  # if the index value j of x is an integer...
                x[j] = alphabet[new[x[j]]]
        encodedstr = "".join(x)  # takes the list x and turns it into a str
        enclist.append(encodedstr)  # add encoded string to list

    declist = decode.split()  # split the decode string into words

    for word in declist:  # for each word in the decoded list
        if word in enclist:  # if the word is found in the encoded list
            print("\nThe rotation is " + str(enclist.index(word) + 1))  # add one because of index behavior
            foundrot = enclist.index(word) + 1  # store the found rotation

    enctodec = ""  # blank string for the decoded result

    for word in declist:  # for each word in the decoded list
        for letter in word:  # for each letter in the word
            decindex = alphabet.index(letter) + foundrot if letter in alphabet else letter
            if isinstance(decindex, int) and decindex > 25:
                decindex -= 26  # adjust index if it goes beyond the alphabet range
            enctodec += alphabet[decindex] if isinstance(decindex, int) else letter  # add decoded letter to the result
        enctodec += " "  # add space between words

    enctodec = enctodec.rstrip()  # remove trailing whitespace

    if foundrot != 0:
        print("The decoded string is: '" + enctodec + "'\n")
    else:
        print("The rotation was not found, thus, the string could not be decoded.\n")

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

''' bringing this project onto a new personal website:
hosting options: github pages or netlify
create simple HTML page
handle requests and submissions to backend: JavaScript
backend framework: flask or express
deploy! 

detailed steps to be taken:
GOING TO USE GITHUB PAGES or similar
1. prepare frontend: use css to style the html page (do it through 
2. backend: flask seems best to incorporate python with
3. connecting front to backend using JavaScript and Fetch API
4. pyodide seems to work as a great option for this idea
6.  Netlify:
     1. Sign up for a Netlify account.
     2. Connect my GitHub repository to Netlify.
7. test for buggies! :)

'''
