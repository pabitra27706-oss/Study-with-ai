#include <stdio.h>

int main(void) {
    int n;
    int values[100];
    if (scanf("%d", &n) != 1 || n < 1 || n > 100) return 1;
    if (scanf("%d", &values[0]) != 1) return 1;

    /* Start from a real element because every input may be positive or negative. */
    int minimum = values[0];
    int maximum = values[0];

    /* Start at one because values[0] was already read and used to initialize both bounds. */
    for (int i = 1; i < n; ++i) {
        if (scanf("%d", &values[i]) != 1) return 1;
        /* Keep the lower bound tied to an actual array value, not an assumed sign. */
        if (values[i] < minimum) {
            /* Replace the lower bound only with a smaller value actually read. */
            minimum = values[i];
        }
        /* Keep the upper bound tied to an actual array value, not an assumed sign. */
        if (values[i] > maximum) {
            /* Replace the upper bound only with a larger value actually read. */
            maximum = values[i];
        }
    }

    printf("%d\n%d\n", minimum, maximum);
    return 0;
}
