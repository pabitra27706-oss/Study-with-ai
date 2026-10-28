#include <stdio.h>

int main()
{
    int n,m, i;
    printf("Which Multiplication table you want to write:");
    scanf("%d",&n);
    printf("The Multiplication table of %d is below:\n",n);
    for (i=1;i<=10;i++){
        m=n*i;
        printf("%d*%d=%d\n\n",n,i,m);
    }
    return 0;
}    