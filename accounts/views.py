from django.shortcuts import render, redirect
from django.conf import settings
from django.core.files.storage import default_storage
from django.http import JsonResponse

from .models import * 


def home(request):
    user = None
    if 'user_id' in request.session:
        user = User.objects.get(id=request.session['user_id'])
    return render(request, 'home.html', {'user': user})
   

def signup(request):
    if request.method == 'POST':
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        profile_picture = request.FILES.get('profile_picture')
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']
        address_line1 = request.POST['address_line1']
        city = request.POST['city']
        state = request.POST['state']
        pincode = request.POST['pincode']
        user_type = request.POST['user_type']
        specialization = request.POST.get('specialization', '')

        if password != confirm_password:
            return render(request, 'signup.html', {'error': 'Passwords do not match'})
        elif User.objects.filter(email = email).exists():
            return render(request, 'login.html', {'error': 'User Already Exists please login...'})
        elif User.objects.filter(username = username).exists():
            return render(request, 'signup.html', {'error': 'Username Already Exists...!'})
        
        user = User(
            first_name=first_name,
            last_name=last_name,
            profile_picture=profile_picture,
            username=username,
            email=email,
            address_line1=address_line1,
            city=city,
            state=state,
            pincode=pincode,
            user_type=user_type,
            specialization = request.POST.get('specialization', '')
        )
        user.set_password(password)
        user.save()
        
        if user_type == 'P':
            Patient.objects.create(user=user)
        elif user_type == 'D':
            Doctor.objects.create(user=user, specialization=specialization)
        
        return redirect('login')

    return render(request, 'signup.html')

def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        try:
            user = User.objects.get(username=username) 
        except User.DoesNotExist:
            try:
                user = User.objects.get(email = username)
            except User.DoesNotExist:
                return render(request, 'login.html', {'error': 'Invalid username or password'})

        if not user.check_password(password):
            return render(request, 'login.html', {'error': 'Invalid username or password'})

        request.session['user_id'] = user.id

        if user.user_type == 'P':
            return redirect('patient_dashboard')
        elif user.user_type == 'D':
            return redirect('doctor_dashboard')

    return render(request, 'login.html')

def check_email_or_username(request):
    email = request.GET.get('email')
    username = request.GET.get('username')
    
    response = {
        'email_exists': User.objects.filter(email=email).exists() if email else False,
        'username_exists': User.objects.filter(username=username).exists() if username else False
    }
    
    return JsonResponse(response)

def logout(request):
    request.session.flush()
    return redirect('home')

def patient_dashboard(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('login')

    user = User.objects.get(id=user_id)
    return render(request, 'patient_dashboard.html', {'user': user})

def doctor_dashboard(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('login')

    user = User.objects.get(id=user_id)
    return render(request, 'doctor_dashboard.html', {'user': user})
