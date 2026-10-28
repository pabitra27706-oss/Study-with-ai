#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    /* The accumulator starts at 1, not 0, because multiplying by zero would
       erase the product - and 0! is defined as 1. */
    long long fact = 1;

    /* n is itself a factor of n!, so the range must include n: i <= n. */
    for (int i = 1; i <= n; i++) {
        /* Multiply rather than add - a factorial is a product of 1..n. */
        fact *= i;
    }

    printf("%lld\n", fact);
    return 0;
}
