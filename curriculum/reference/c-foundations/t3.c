#include <stdio.h>

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 1;
    long long total = 0;

    /* Include n itself because the prompt defines the range as ending at n. */
    for (int i = 1; i <= n; ++i) {
        /* Add each integer once so n=0 naturally leaves the empty sum at zero. */
        total += i;
    }

    printf("%lld\n", total);
    return 0;
}
