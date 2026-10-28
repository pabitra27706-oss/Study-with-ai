#include <stdio.h>

// Recursive function declaration
unsigned long long calculateFactorial(int n) {
    if (n == 0) {
        return 1; // Base case: 0! = 1
    }
    return n * calculateFactorial(n - 1); // Recursive case
}

int main() {
    int n;

    printf("Enter an integer: ");
    scanf("%d", &n);

    if (n < 0) {
        printf("Error: Factorial of a negative number does not exist.\n");
    } else {
        printf("Factorial of %d = %llu\n", n, calculateFactorial(n));
    }

    return 0;
}
