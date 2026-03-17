"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '../components/Container';
import ProductCard from '../components/ProductCard';
import api from '../lib/api';
import { ChevronDown } from 'lucide
