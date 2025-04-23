
def printMsg(params:dict)->str:
    msg=""
    for key ,value in params.items():
        if value!='' and value!=0 and value!=None:
            msg+=f"{key}:{value}, "

    return msg