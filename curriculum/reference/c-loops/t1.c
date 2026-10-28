#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    /* The range is 1..n inclusive, so the test is i <= n - using i < n would
       stop one short and never print n itself. */
    for (int i = 1; i <= n; i++) {
        /* A space goes before every number except the first, so the output
           has no trailing space and still separates the numbers. */
        if (i > 1) printf(" ");
        printf("%d", i);
    }
    printf("\n");
    return 0;
}
