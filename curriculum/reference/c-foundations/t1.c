#include <stdio.h>

int main(void) {
    int a, b;
    if (scanf("%d %d", &a, &b) != 2) return 1;

    /* The input bounds keep both results within int, so widening adds no value here. */
    printf("%d\n%d\n", a + b, a - b);
    return 0;
}
