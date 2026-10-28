#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int sum = 0;

    /* The loop stops when n reaches 0, because 0 means there are no digits left. */
    while (n > 0) {
        /* Take the remainder before dividing: n % 10 is the last digit, and
           dividing first would throw that digit away. */
        sum += n % 10;
        n /= 10;
    }

    printf("%d\n", sum);
    return 0;
}
