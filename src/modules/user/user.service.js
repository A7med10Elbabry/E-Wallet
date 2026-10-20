export const profile   = (user)=>{
    return user
}

export const logout = async (user)=>{
    user.changeCredentialsTime = new Date()
    await user.save()
}



