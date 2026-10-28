#include <stdio.h>

int main()
{
    int n,i;
    printf("Enter the last number from 1 to print. ");
    scanf("%d",&n);
    for (i=1;i<=n;i++){
        printf("\n%d",i);
    }
}