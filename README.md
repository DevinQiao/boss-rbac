# 前端项目说明文档

## 一、操作页面/表单

### 1.登录页面

![image-20220605151427490](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605151427490.png)

### 2~6个人中心

#### 2.个人信息

![image-20220605151453050](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605151453050.png)

#### 3.系统头像

![image-20220605151525056](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605151525056.png)

#### 4.上传头像

![image-20220605151606784](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605151606784.png)

#### 5.编辑个人信息

![image-20220605151646295](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605151646295.png)

#### 6.重置密码

![image-20220605151743056](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605151743056.png)

### 7~11用户管理

#### 7.用户信息管理

![image-20220605151828885](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605151828885.png)

#### 8.新建用户

![image-20220605151906031](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605151906031.png)

#### 9.修改用户

![image-20220605151929450](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605151929450.png)

#### 10.用户角色分配

![image-20220605152003597](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605152003597.png)

#### 11.分配角色表单

![image-20220605152028914](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605152028914.png)

### 12~16角色管理

#### 12.角色管理列表

![image-20220605152122380](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605152122380.png)

#### 13.新增角色

![image-20220605152142390](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605152142390.png)

#### 14.修改角色

![image-20220605152204677](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605152204677.png)

#### 15.分配用户

![image-20220605152239167](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605152239167.png)

#### 16.分配权限

![image-20220605152316034](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605152316034.png)



### 17~20权限管理

#### 17.权限管理列表

![image-20220605152401127](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605152401127.png)

#### 18.新建权限

![image-20220605152422613](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605152422613.png)

#### 19.修改权限

![image-20220605152521984](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605152521984.png)

#### 20.分配角色

![image-20220605152504873](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605152504873.png)

## 二、表单校验

**以下简单列举以下目前系统使用的表单校验规则，其中每一种一般都有多处地方可以实现，因此表单校验的数量应该满足要求**

### 1.某些字段特定条件下可修改，其他情况不可修改

分配角色时用户名不可以修改

![image-20220605153352567](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605153352567.png)

### 2.必填项未填不能通过校验并有警示

![image-20220605153437888](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605153437888.png)

### 3.录入值在有效范围外不能通过有效性检查

![image-20220605153529555](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605153529555.png)

### 4.字符型最大长度检查，特别留意多行文本框的最大长度检查

![image-20220605153651117](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605153651117.png)

### 5.录入字符型特殊字符如“空格'!@#$%^&*()<>{}[]|\+_=-:";',.?/`~”,中文字符等能正确处理

![image-20220605153722248](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605153722248.png)

### 6.文件型字段的文件名符合要求能通过有效性验证并被正确处理

![image-20220605153925022](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605153925022.png)

### 7.文件型字段的文件大小超过限制条件不能通过有效性验证且有提示

![image-20220605153854567](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605153854567.png)

### 8.在有search功能的地方输入系统不存在的内容,应该search不到结果.如果可以输入多个search条件,可以同时添加合理和不合理的条件,系统应能正确处理

![image-20220605154049838](C:\Users\bin16\AppData\Roaming\Typora\typora-user-images\image-20220605154049838.png)

### 9.检查添加和修改信息的要求是否一致,例如添加要求必填的项,修改也应该必填

添加和修改使用的同一个表单，校验规则一致。