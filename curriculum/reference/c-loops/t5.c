#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    /* The range is 1..n inclusive, so the test is i <= n. */
    for (int i = 1; i <= n; i++) {
        /* Test divisibility by 15 first: 15 is a multiple of both 3 and 5, so
           one test covers FizzBuzz. Testing 3 and 5 separately would print
           Fizz for 15 and never reach FizzBuzz. */
        if (i % 15 == 0)
            printf("FizzBuzz\n");
        else if (i % 3 == 0)
            printf("Fizz\n");
        else if (i % 5 == 0)
            printf("Buzz\n");
        else
            printf("%d\n", i);
    }

    return 0;
}
