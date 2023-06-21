#include <iostream>
#include <Windows.h>

// 添加 user32.lib 到链接器的附加依赖项
#pragma comment(lib, "user32.lib") 

int main()
{

    CURSORINFO cursorInfo = { sizeof(CURSORINFO) };
    GetCursorInfo(&cursorInfo);

    if (cursorInfo.flags == CURSOR_SHOWING)
    {
        HCURSOR hCursor = cursorInfo.hCursor;
        if (hCursor != NULL)
        {
            if (hCursor == LoadCursor(NULL, IDC_IBEAM))
            {
                // 文本选择状态
                std::cout << "1";
            } 
            else
            {
                // 非文本选择状态
                std::cout << "0";
            }
        }
    }
    return 0;
}