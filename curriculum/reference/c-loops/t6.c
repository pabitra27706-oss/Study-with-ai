#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    /* The counter runs 1..10 because there are ten multiples of n, and the
       counter is the multiple itself, so it must start at 1 and reach 10. */
    for (int i = 1; i <= 10; i++) {
        /* Multiply n by the counter so each term is the next multiple. */
        printf("%d", n * i);
        /* Space after every term except the last, so the output has no
           trailing space. */
        if (i < 10) printf(" ");
    }
    printf("\n");
    return 0;
}
