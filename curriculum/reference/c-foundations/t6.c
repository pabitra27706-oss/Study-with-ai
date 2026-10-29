#include <stdio.h>
#include <stdlib.h>

struct Reading {
    int value;
};

int main(void) {
    int n;
    if (scanf("%d", &n) != 1 || n < 1 || n > 100) return 1;

    /* sizeof *readings follows the struct type, and n objects are needed for n readings. */
    struct Reading *readings = malloc((size_t)n * sizeof *readings);
    /* A failed allocation has no object to access, so stop before any dereference. */
    if (readings == NULL) return 1;

    /* Initialize from the first value so all-negative inputs are handled correctly. */
    if (scanf("%d", &readings[0].value) != 1) {
        free(readings);
        return 1;
    }
    int greatest = readings[0].value;

    /* Read each remaining field because its struct slot is valid only after initialization. */
    for (int i = 1; i < n; ++i) {
        if (scanf("%d", &readings[i].value) != 1) {
            free(readings);
            return 1;
        }
        /* Replace the current maximum only when a stored reading exceeds it. */
        if (readings[i].value > greatest) {
            /* Keep the maximum at the largest value observed so far. */
            greatest = readings[i].value;
        }
    }

    printf("%d\n", greatest);
    /* Free the block because this function owns it and no later code needs it. */
    free(readings);
    return 0;
}
