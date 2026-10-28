#include <stdio.h>

int main(void) {
    int n;
    /* The stack is a fixed array of 100 slots, big enough for any input
       this task allows, and zeroed so no slot is ever uninitialised. */
    int stack[100] = {0};
    /* -1 means the stack is empty, because no slot has been used yet. */
    int top = -1;

    scanf("%d", &n);

    /* One push per value, so the loop count is the number of values. */
    for (int i = 0; i < n; i++) {
        int value;
        scanf("%d", &value);
        /* The next free slot is one past the current top, because the stack
           grows towards higher indices. */
        top = top + 1;
        /* Put the value in that slot, so the stack grows towards higher
           indices and the newest value ends up on top. */
        stack[top] = value;
    }

    /* Pop means taking the top value off, so we print it first and only
       then move the top down one, so the value below becomes the new top. */
    printf("%d\n", stack[top]);
    top = top - 1;

    /* Peek looks at the top without taking it off, so the top stays where
       it is and the value can be read again. */
    printf("%d\n", stack[top]);

    return 0;
}
