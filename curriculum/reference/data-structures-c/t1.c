#include <stdio.h>
#include <stdlib.h>

/* One value plus the address of the node after it. The address is the
   whole point: it lets the nodes sit anywhere in memory instead of
   having to be neighbours, which is what an array cannot do. */
struct Node {
    int data;
    struct Node *next;
};

int main(void) {
    int n;
    struct Node *head = NULL;

    scanf("%d", &n);

    /* One node per value, so the loop count is the number of values. */
    for (int i = 0; i < n; i++) {
        int value;
        struct Node *temp;
        scanf("%d", &value);

        /* Ask for room for exactly one node, because the list grows one
           element at a time and we do not know the final size yet. */
        temp = (struct Node *)malloc(sizeof(struct Node));

        /* Store the value, and leave the link empty for now, because we do
           not know yet which node this one has to point at. */
        temp->data = value;
        temp->next = NULL;

        if (head == NULL) {
            /* The list was empty, so the new node is the whole list. */
            head = temp;
        } else {
            struct Node *walk = head;
            /* Stop one node before the end, because that node's next
               pointer is the place the new node has to be attached. */
            while (walk->next != NULL) {
                /* Move one node forward, because the last node is the one we attach to. */
                walk = walk->next;
            }
            /* Attach the new node after the last one, so the order the
               values were read in is the order the list holds them in. */
            walk->next = temp;
        }
    }

    struct Node *cursor = head;
    /* Print from the head, one value per line, because the head is where
       the list starts. */
    while (cursor != NULL) {
        printf("%d\n", cursor->data);
        /* Step to the next node, or stop, because a null next pointer means
           the list has ended. */
        cursor = cursor->next;
    }

    /* Give every node back, so the program does not leak the memory. */
    while (head != NULL) {
        struct Node *dead = head;
        /* Save the next node first, because freeing this one loses its link. */
        head = head->next;
        free(dead);
    }

    return 0;
}
