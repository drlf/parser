
exports.ClearNullArr = ClearNullArr;

/**
 * 清除数组中为空的项
**/
function ClearNullArr(arr)
{
    for(var i=0;i<arr.length;i++)
    {
        if(!arr[i]||arr[i]=='')
        {
            arr.splice(i,1);
        }
    }
    return arr;
}