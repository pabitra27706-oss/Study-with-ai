#include <stdio.h>

void swap_values(int *left, int *right) {
    int saved = *left;
    *left = *right;
    *right = saved;
}

int main(void) {
    int a, b;
    if (scanf("%d %d", &a, &b) != 2) return 1;

    /* Pass addresses because ordinary integer parameters would only change local copies. */
    swap_values(&a, &b);
    printf("%d\n%d\n", a, b);
    return 0;
}
