#include <stdio.h>

int main(void) {
    int n;
    /* The queue is a fixed array of 4 slots, and zeroed so no slot is ever
       read before something has been written into it. */
    int queue[4] = {0};
    /* front is the slot the next value comes out of, because the queue is
       first in first out. */
    int front = 0;
    /* rear is the slot the last value went into; -1 means the queue is
       empty, because no slot has been used yet. */
    int rear = -1;

    scanf("%d", &n);

    /* One enqueue per value, so the loop count is the number of values. */
    for (int i = 0; i < n; i++) {
        int value;
        scanf("%d", &value);
        /* Move to the next slot, wrapping back to 0 when we run past the
           end of the array, so the slots we have freed get used again. */
        rear = (rear + 1) % 4;
        /* Put the value at the rear, so it is the last one to come out. */
        queue[rear] = value;
    }

    /* The first value to come out is the one that went in first, so the
       front slot holds the oldest value that is still in the queue. */
    printf("%d\n", queue[front]);
    /* Step the front to the next slot, wrapping so we come back round. */
    front = (front + 1) % 4;

    int extra;
    scanf("%d", &extra);
    /* Put the new value at the rear, wrapping round when the array is
       full, so the queue can be used again after it has been drained. */
    rear = (rear + 1) % 4;
    queue[rear] = extra;

    /* Print everything that is left, from the front all the way round to
       the rear, so the order the values went in is the order they come out. */
    for (int count = 0; count < n; count++) {
        printf("%d\n", queue[front]);
        /* Step to the next slot, wrapping so we reach the rear and stop. */
        front = (front + 1) % 4;
    }

    return 0;
}
