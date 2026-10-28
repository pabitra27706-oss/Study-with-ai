#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int rev = 0;

    /* Stop when n reaches 0, because then every digit has been moved into rev. */
    while (n > 0) {
        /* rev * 10 shifts the digits already collected one place to the left,
           then adding the new digit puts it at the front - that is why it is
           rev * 10 + digit and not rev + digit. */
        rev = rev * 10 + n % 10;
        n /= 10;
    }

    printf("%d\n", rev);
    return 0;
}
