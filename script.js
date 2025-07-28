// script.js

// আপনার Firebase কনফিগারেশন অবজেক্ট
const firebaseConfig = {
  apiKey: "AIzaSyDhAvbNT5-YNe0yts-Kr32txzkddx9o_E",
  authDomain: "tiktok-clone-6f9a6.firebaseapp.com",
  databaseURL: "https://tiktok-clone-6f9a6-default-rtdb.firebaseio.com", 
  projectId: "tiktok-clone-6f9a6",
  storageBucket: "tiktok-clone-6f9a6.firebasestorage.app", 
  messagingSenderId: "891350173080",
  appId: "1:891350173080:web:c03348422f344d15a4d7ed",
  measurementId: "G-HTXM1BL4BB"
};

// Firebase মডিউলগুলো ইম্পোর্ট করুন
// **গুরুত্বপূর্ণ: নিশ্চিত করুন 10.x.x এর জায়গায় আপনার ব্যবহৃত Firebase SDK সংস্করণ নম্বর আছে।**
// যেমন, যদি আপনার Firebase SDK 10.5.0 হয়, তাহলে `10.5.0` লিখুন।
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";


// Firebase অ্যাপ ইনিশিয়ালাইজ করুন
const app = initializeApp(firebaseConfig);

// Authentication সার্ভিস ইনিশিয়ালাইজ করুন
const auth = getAuth(app);


// ----------------- HTML উপাদানগুলো সিলেক্ট করুন -----------------
const authModal = document.getElementById('authModal');
const closeButton = authModal ? authModal.querySelector('.close-button') : null;
const phoneEmailForm = document.getElementById('phoneEmailForm');
const emailPhoneInput = document.getElementById('emailPhoneInput');
const passwordInput = document.getElementById('passwordInput');
const signInButton = document.getElementById('signInButton');
const signUpButton = document.getElementById('signUpButton');
const phoneAuthBtn = document.getElementById('phoneAuthBtn');
const googleAuthBtn = document.getElementById('googleAuthBtn');
const showSignupSpan = document.getElementById('showSignup');
const showLoginSpan = document.getElementById('showLogin');

const mediaFeedContainer = document.querySelector('.media-feed-container'); // Changed from video-feed-container
const profilePage = document.getElementById('profilePage');
const inboxPage = document.getElementById('inboxPage');
const adminPanel = document.getElementById('adminPanel'); 

// প্রোফাইল পেজের উপাদান
const profileTabs = document.querySelectorAll('.profile-tab-item');
const profileVideosContent = document.getElementById('profileVideosContent');
const profileLikedContent = document.getElementById('profileLikedContent');
const profileDraftsContent = document.getElementById('profileDraftsContent');
const followButton = document.querySelector('.profile-action-btn.follow-button');

// ইনবক্স পেজের উপাদান
const inboxBackBtn = document.getElementById('inboxBackBtn');

// অডিও প্লেয়াররা (আপনার প্রতিটি মিডিয়া কার্ডে থাকা অডিও)
const audioPlayers = document.querySelectorAll('.audio-player');


// ----------------- মডাল ফাংশনালিটি -----------------
function showAuthModal() {
    console.log("FUNCTION CALL: showAuthModal()");
    if (authModal) {
        authModal.style.display = 'flex';
        // নিশ্চিত করুন যে প্রথমবার মডাল খোলার সময় লগইন অপশন ডিফল্ট থাকে
        if (phoneEmailForm) phoneEmailForm.style.display = 'none'; 
        if (showSignupSpan) showSignupSpan.style.display = 'inline'; 
        if (showLoginSpan) showLoginSpan.style.display = 'none'; 
        if (signInButton) signInButton.style.display = 'inline-block';
        if (signUpButton) signUpButton.style.display = 'inline-block';

        emailPhoneInput.value = ''; 
        passwordInput.value = '';
    } else {
        console.error("Error: authModal element not found!");
    }
}

function hideAuthModal() {
    console.log("FUNCTION CALL: hideAuthModal()");
    if (authModal) {
        authModal.style.display = 'none';
        if (phoneEmailForm) {
            phoneEmailForm.style.display = 'none';
            emailPhoneInput.value = '';
            passwordInput.value = '';
            if (showSignupSpan) showSignupSpan.style.display = 'inline';
            if (showLoginSpan) showLoginSpan.style.display = 'none';
        }
    }
}

// ----------------- মডাল ইভেন্ট লিসেনার -----------------
if (closeButton) {
    closeButton.addEventListener('click', hideAuthModal);
    console.log("Event Listener: closeButton click attached.");
}
if (authModal) {
    window.addEventListener('click', (event) => {
        if (event.target == authModal) {
            hideAuthModal();
        }
    });
    console.log("Event Listener: window click (for authModal outside click) attached.");
}


if (phoneAuthBtn) {
    phoneAuthBtn.addEventListener('click', () => {
        console.log("CLICK: Phone/Email Auth button.");
        if (phoneEmailForm) phoneEmailForm.style.display = 'block';
        if (signInButton) signInButton.style.display = 'inline-block';
        if (signUpButton) signUpButton.style.display = 'inline-block'; 
        if (showSignupSpan) showSignupSpan.style.display = 'inline';
        if (showLoginSpan) showLoginSpan.style.display = 'none';
    });
    console.log("Event Listener: phoneAuthBtn click attached.");
}

if (showSignupSpan) {
    showSignupSpan.addEventListener('click', () => {
        console.log("CLICK: Show Signup.");
        if (signInButton) signInButton.style.display = 'none';
        if (signUpButton) signUpButton.style.display = 'inline-block';
        if (showSignupSpan) showSignupSpan.style.display = 'none';
        if (showLoginSpan) showLoginSpan.style.display = 'inline';
    });
    console.log("Event Listener: showSignupSpan click attached.");
}

if (showLoginSpan) {
    showLoginSpan.addEventListener('click', () => {
        console.log("CLICK: Show Login.");
        if (signInButton) signInButton.style.display = 'inline-block';
        if (signUpButton) signUpButton.style.display = 'none';
        if (showSignupSpan) showSignupSpan.style.display = 'inline';
        if (showLoginSpan) showLoginSpan.style.display = 'none';
    });
    console.log("Event Listener: showLoginSpan click attached.");
}

// ----------------- Firebase Authentication -----------------
if (signUpButton) {
    signUpButton.addEventListener('click', () => {
        const email = emailPhoneInput.value;
        const password = passwordInput.value;
        console.log("AUTH: Attempting sign up with:", email);

        if (email && password) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('AUTH: User signed up:', user);
                    alert('Sign up successful! You are now logged in.');
                    hideAuthModal();
                })
                .catch((error) => {
                    console.error('AUTH ERROR: Sign up error:', error.code, error.message);
                    alert(`Sign up failed: ${error.message}`);
                });
        } else {
            alert('Please enter both email/phone and password.');
        }
    });
    console.log("Event Listener: signUpButton click attached.");
}

if (signInButton) {
    signInButton.addEventListener('click', () => {
        const email = emailPhoneInput.value;
        const password = passwordInput.value;
        console.log("AUTH: Attempting sign in with:", email);

        if (email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('AUTH: User signed in:', user);
                    alert('Login successful!');
                    hideAuthModal();
                })
                .catch((error) => {
                    console.error('AUTH ERROR: Login error:', error.code, error.message);
                    alert(`Login failed: ${error.message}`);
                });
        } else {
            alert('Please enter both email/phone and password.');
        }
    });
    console.log("Event Listener: signInButton click attached.");
}

if (googleAuthBtn) {
    googleAuthBtn.addEventListener('click', () => {
        console.log("AUTH: Google Auth button clicked.");
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log('AUTH: Google login successful:', user);
                alert('Logged in with Google!');
                hideAuthModal();
            }).catch((error) => {
                console.error('AUTH ERROR: Google login error:', error.code, error.message);
                alert(`Google login failed: ${error.message}`);
            });
    });
    console.log("Event Listener: googleAuthBtn click attached.");
}

// Firebase Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("AUTH STATE: User is logged in:", user.email || user.phoneNumber || user.displayName);

        const adminEmail = "djr93767@gmail.com"; // <-- আপনার অ্যাডমিন জিমেইল

        if (user.email === adminEmail) {
            console.log("AUTH STATE: Admin user logged in!");
        } else {
            console.log("AUTH STATE: Regular user logged in.");
            if (adminPanel) { // যদি adminPanel থাকে
                adminPanel.style.display = 'none'; // রেগুলার ইউজারের জন্য অ্যাডমিন প্যানেল লুকান
            }
        }
    } else {
        console.log("AUTH STATE: User is logged out.");
        if (adminPanel) { // যদি adminPanel থাকে
            adminPanel.style.display = 'none'; // লগআউট অবস্থায় অ্যাডমিন প্যানেল লুকান
        }
    }
});


// ----------------- লাইক বাটন ফাংশনালিটি -----------------
document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', () => {
        console.log("CLICK: Like button.");
        const likeIcon = button.querySelector('i');
        const likeCountSpan = button.querySelector('.like-count');
        
        if (!likeIcon.classList.contains('liked')) {
            likeIcon.classList.add('liked'); 
            
            let currentLikes = likeCountSpan.textContent;
            let numLikes;

            if (currentLikes.includes('M')) {
                numLikes = parseFloat(currentLikes) * 1000000;
            } else if (currentLikes.includes('K')) {
                numLikes = parseFloat(currentLikes) * 1000;
            } else {
                numLikes = parseInt(currentLikes);
            }
            
            numLikes++; 
            
            if (numLikes >= 1000000) {
                likeCountSpan.textContent = (numLikes / 1000000).toFixed(1) + 'M';
            } else if (numLikes >= 1000) {
                likeCountSpan.textContent = (numLikes / 1000).toFixed(1) + 'K';
            } else {
                likeCountSpan.textContent = numLikes.toString();
            }
            
        } 
    });
    console.log("Event Listener: Like button attached.");
});

// ----------------- ফলো/আনফলো বাটন ফাংশনালিটি (শুধুমাত্র UI) -----------------
if (followButton) {
    followButton.addEventListener('click', () => {
        console.log("CLICK: Follow/Unfollow button.");
        if (followButton.classList.contains('follow-button')) {
            followButton.classList.remove('follow-button');
            followButton.classList.add('unfollow-button');
            followButton.textContent = 'Following';
            alert('You are now following this user!');
        } else {
            followButton.classList.remove('unfollow-button');
            followButton.classList.add('follow-button');
            followButton.textContent = 'Follow';
            alert('You have unfollowed this user.');
        }
    });
    console.log("Event Listener: followButton click attached.");
}


// ----------------- নিচের নেভিগেশন বার ফাংশনালিটি -----------------
const navItems = document.querySelectorAll('.bottom-nav .nav-item');
navItems.forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault();
        console.log("CLICK: Nav item clicked. Target:", item.dataset.navTarget);

        // সব নেভিগেশন আইটেম থেকে 'active' ক্লাস সরান
        navItems.forEach(nav => nav.classList.remove('active'));
        // বর্তমান ক্লিক করা আইটেমে 'active' ক্লাস যোগ করুন
        item.classList.add('active');

        const target = item.dataset.navTarget;
        console.log(`Navigating to: ${target}`);

        // সব কন্টেইনার লুকিয়ে রাখুন
        if (mediaFeedContainer) mediaFeedContainer.style.display = 'none'; // Changed
        if (profilePage) profilePage.style.display = 'none';
        if (inboxPage) inboxPage.style.display = 'none';
        if (authModal) authModal.style.display = 'none'; 
        if (adminPanel) adminPanel.style.display = 'none'; 


        if (target === 'profile') {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // যদি ইউজার লগইন করা থাকে, তবে প্রোফাইল পেজ দেখান
                    if (profilePage) profilePage.style.display = 'flex';
                    console.log('User is logged in. Showing profile content!');
                    // ডিফল্টভাবে ভিডিও ট্যাব সক্রিয় করুন এবং অন্যান্য ট্যাব লুকান
                    profileTabs.forEach(tab => tab.classList.remove('active'));
                    const videosTab = document.querySelector('.profile-tab-item[data-tab="videos"]');
                    if (videosTab) videosTab.classList.add('active');
                    if (profileVideosContent) profileVideosContent.style.display = 'grid'; 
                    if (profileLikedContent) profileLikedContent.style.display = 'none'; 
                    if (profileDraftsContent) profileDraftsContent.style.display = 'none'; 

                } else {
                    showAuthModal();
                    item.classList.remove('active');
                    const homeNavItem = document.querySelector('.bottom-nav .nav-item[data-nav-target="home"]');
                    if(homeNavItem) homeNavItem.classList.add('active');
                    console.log('User not logged in. Showing auth modal instead of profile.');
                }
            });
        } else if (target === 'inbox') {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    if (inboxPage) inboxPage.style.display = 'flex';
                    console.log('User is logged in. Showing Inbox!');
                } else {
                    showAuthModal();
                    item.classList.remove('active');
                    const homeNavItem = document.querySelector('.bottom-nav .nav-item[data-nav-target="home"]');
                    if(homeNavItem) homeNavItem.classList.add('active');
                    console.log('User not logged in. Showing auth modal instead of inbox.');
                }
            });
        } else if (target === 'admin') { 
            onAuthStateChanged(auth, (user) => {
                const adminEmail = "djr93766@gmail.com"; 
                if (user && user.email === adminEmail) {
                    if (adminPanel) {
                        adminPanel.style.display = 'flex'; 
                        console.log('Admin user logged in. Showing Admin Panel!');
                    } else {
                        console.error("Error: adminPanel element not found!");
                        alert("Admin panel element not found!");
                    }
                } else {
                    showAuthModal();
                    item.classList.remove('active');
                    const homeNavItem = document.querySelector('.bottom-nav .nav-item[data-nav-target="home"]');
                    if(homeNavItem) homeNavItem.classList.add('active');
                    console.log('User not logged in or not admin. Showing auth modal instead of Admin Panel.');
                }
            });
        }
        else if (target === 'create') {
            alert('You clicked Create! (This would open the video creation screen)');
            if (mediaFeedContainer) mediaFeedContainer.style.display = 'flex';
            navItems.forEach(nav => nav.classList.remove('active'));
            const homeNavItem = document.querySelector('.bottom-nav .nav-item[data-nav-target="home"]');
            if(homeNavItem) homeNavItem.classList.add('active');
            console.log('Navigated to Create, then back to Home.');
        } else if (target === 'home') {
            if (mediaFeedContainer) mediaFeedContainer.style.display = 'flex';
            const mediaFeedContainerScroll = document.querySelector('.media-feed-container'); // Changed
            if (mediaFeedContainerScroll) {
                mediaFeedContainerScroll.scrollTo({ top: 0, behavior: 'smooth' });
            }
            console.log('Navigated to Home.');
        } else if (target === 'friends') {
            alert('You clicked Friends! (This would show your friends feed)');
            if (mediaFeedContainer) mediaFeedContainer.style.display = 'flex';
            navItems.forEach(nav => nav.classList.remove('active'));
            const homeNavItem = document.querySelector('.bottom-nav .nav-item[data-nav-target="home"]');
            if(homeNavItem) homeNavItem.classList.add('active');
            console.log('Navigated to Friends, then back to Home.');
        }
    });
    console.log("Event Listener: Nav item click attached.");
});

// ----------------- প্রোফাইল ট্যাব ফাংশনালিটি -----------------
profileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        console.log("CLICK: Profile tab clicked. Target:", tab.dataset.tab);
        profileTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const tabTarget = tab.dataset.tab;

        if (profileVideosContent) profileVideosContent.style.display = 'none';
        if (profileLikedContent) profileLikedContent.style.display = 'none';
        if (profileDraftsContent) profileDraftsContent.style.display = 'none';

        if (tabTarget === 'videos') {
            if (profileVideosContent) profileVideosContent.style.display = 'grid';
        } else if (tabTarget === 'liked') {
            if (profileLikedContent) profileLikedContent.style.display = 'grid';
        } else if (tabTarget === 'drafts') {
            if (profileDraftsContent) profileDraftsContent.style.display = 'flex';
        }
    });
    console.log("Event Listener: Profile tabs attached.");
});

// ----------------- ইনবক্স ব্যাক বাটন ফাংশনালিটি -----------------
if (inboxBackBtn) {
    inboxBackBtn.addEventListener('click', () => {
        console.log("CLICK: Inbox back button.");
        if (inboxPage) inboxPage.style.display = 'none';
        if (mediaFeedContainer) mediaFeedContainer.style.display = 'flex'; 
        navItems.forEach(nav => nav.classList.remove('active'));
        const homeNavItem = document.querySelector('.bottom-nav .nav-item[data-nav-target="home"]');
        if(homeNavItem) homeNavItem.classList.add('active');
    });
    console.log("Event Listener: inboxBackBtn click attached.");
}


// ----------------- অডিও প্লেব্যাক নিয়ন্ত্রণ (ছবি স্ক্রল করার সাথে অডিও প্লে/পজ) -----------------
// অডিও অটো-প্লে সমস্যা: আধুনিক ব্রাউজারগুলো স্বয়ংক্রিয়ভাবে অডিও প্লে করতে দেয় না যদি না ইউজার কোনো ইন্টারঅ্যাকশন করে থাকে।
// তাই এখানে স্ক্রল করলে অটোমেটিক প্লে হবে না, ইউজারকে নিজে প্লে করতে হবে।
// যদি আপনি স্ক্রল করার সময় অডিও প্লে/পজ করতে চান (ভিডিওর মতো), তবে অডিও প্লেয়ারের `controls` অ্যাট্রিবিউট সরিয়ে JavaScript দিয়ে প্লেব্যাক নিয়ন্ত্রণ করতে হবে।

if (mediaFeedContainer) {
    mediaFeedContainer.addEventListener('scroll', () => {
        audioPlayers.forEach(audio => {
            const rect = audio.parentElement.getBoundingClientRect(); // Parent is media-card
            const viewportHeight = window.innerHeight;

            // Check if the media card (image/audio combo) is largely within the viewport
            if (rect.top >= -0.5 * viewportHeight && rect.bottom <= 1.5 * viewportHeight) { // Expanded range
                // We don't autoplay audio without user interaction to avoid browser blocking.
                // User will click the audio controls to play/pause.
            } else {
                // Pause audio if media card is outside view
                if (!audio.paused) {
                    audio.pause();
                    audio.currentTime = 0; // Reset audio to start
                }
            }
        });
    });
    console.log("Event Listener: mediaFeedContainer scroll attached.");
}

// DOM Content Loaded to ensure initial UI state is correct
document.addEventListener('DOMContentLoaded', () => { 
    console.log("DOM Content Loaded. Initializing UI state.");
    if (mediaFeedContainer) mediaFeedContainer.style.display = 'flex';
    if (profilePage) profilePage.style.display = 'none';
    if (inboxPage) inboxPage.style.display = 'none';
    if (authModal) authModal.style.display = 'none'; 
    if (adminPanel) adminPanel.style.display = 'none'; 

    // Activate the 'Home' navigation item by default
    navItems.forEach(nav => nav.classList.remove('active'));
    const homeNavItem = document.querySelector('.bottom-nav .nav-item[data-nav-target="home"]');
    if (homeNavItem) {
        homeNavItem.classList.add('active');
    }
});