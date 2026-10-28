#include <stdio.h>

int main()
{
    int n, i;
    char d;
    
    printf("Enter the last number from 1 to check the odd or even numbers between them: ");
    scanf("%d", &n);
    printf("What you want to check (e for even / o for odd): ");
    scanf(" %c", &d);
    
    if (d == 'e' || d == 'E') {
        printf("Even numbers from 1 to %d:\n", n);
        for (i = 1; i <= n; i++) {
            if (i % 2 == 0) {
                printf("%d\n", i);
            }
        }
    }
    else if (d == 'o' || d == 'O') {
        printf("Odd numbers from 1 to %d:\n", n);
        for (i = 1; i <= n; i++) {
            if (i % 2 != 0) {
                printf("%d\n", i);
            }
        }
    }
    else {
        printf("Invalid input. Please enter 'e' for even or 'o' for odd.\n");
    }
    
    return 0;
}