#include <stdio.h>

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 1;

    /* Zero needs its own branch because it is neither positive nor negative. */
    if (n > 0) {
        printf("POSITIVE\n");
    } else if (n < 0) {
        printf("NEGATIVE\n");
    } else {
        printf("ZERO\n");
    }

    /* Test the remainder because even negative inputs also have remainder zero. */
    if (n % 2 == 0) {
        printf("EVEN\n");
    } else {
        printf("ODD\n");
    }
    return 0;
}
