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
    del tomod[-rotationint:] #takes duplicated list of number and deletes numbers from the right by the # of