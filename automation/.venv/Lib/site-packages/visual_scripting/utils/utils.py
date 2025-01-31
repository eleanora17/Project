import time

def sleep(time_seconds):
    t=1
    while t<time_seconds:
        print(f"Sleeping {t}/{time_seconds}")
        time.sleep(1)
        t+=1